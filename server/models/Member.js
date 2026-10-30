import mongoose from 'mongoose';
import { memoryStore, isConnectedToMongo } from '../config/db.js';

// Mongoose Member Schema
const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    membershipDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);

export const MemberModel = {
  find: async (query) => {
    if (isConnectedToMongo) {
      try {
        const mongoQuery = {};
        if (query?.status && query.status !== 'All') {
          mongoQuery.status = query.status;
        }
        if (query?.search) {
          const s = query.search.trim();
          mongoQuery.$or = [
            { name: { $regex: s, $options: 'i' } },
            { email: { $regex: s, $options: 'i' } },
            { phone: { $regex: s, $options: 'i' } },
          ];
        }
        const results = await Member.find(mongoQuery).sort({ createdAt: -1 }).lean();
        if (results.length > 0) return results;
      } catch (e) {
        console.warn('MongoDB member query fallback:', e.message);
      }
    }

    let members = [...memoryStore.getMembers()];
    if (query?.status && query.status !== 'All') {
      members = members.filter(m => m.status === query.status);
    }
    if (query?.search) {
      const q = query.search.toLowerCase().trim();
      members = members.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q)
      );
    }
    return members.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  findById: async (id) => {
    if (isConnectedToMongo) {
      try {
        const found = await Member.findById(id).lean();
        if (found) return found;
      } catch {
        // continue
      }
    }
    const member = memoryStore.getMembers().find(m => m._id.toString() === id.toString());
    return member || null;
  },

  findOne: async (filter) => {
    if (isConnectedToMongo) {
      try {
        const found = await Member.findOne(filter).lean();
        if (found) return found;
      } catch {
        // continue
      }
    }
    const members = memoryStore.getMembers();
    return members.find(m => Object.entries(filter).every(([k, v]) => m[k] === v)) || null;
  },

  create: async (data) => {
    const payload = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      membershipDate: data.membershipDate || new Date().toISOString().split('T')[0],
      status: data.status || 'Active',
    };

    if (isConnectedToMongo) {
      try {
        const createdMongo = await Member.create(payload);
        return createdMongo.toObject();
      } catch (e) {
        console.warn('MongoDB member create error:', e.message);
      }
    }

    const members = memoryStore.getMembers();
    const newMember = {
      ...payload,
      _id: `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    members.push(newMember);
    memoryStore.setMembers(members);
    return newMember;
  },

  findByIdAndUpdate: async (id, updateData) => {
    if (isConnectedToMongo) {
      try {
        const updated = await Member.findByIdAndUpdate(id, updateData, { new: true }).lean();
        if (updated) return updated;
      } catch {
        // continue
      }
    }

    const members = memoryStore.getMembers();
    const index = members.findIndex(m => m._id.toString() === id.toString());
    if (index === -1) return null;

    const current = members[index];
    const updated = {
      ...current,
      ...updateData,
    };
    members[index] = updated;
    memoryStore.setMembers(members);
    return updated;
  },

  findByIdAndDelete: async (id) => {
    if (isConnectedToMongo) {
      try {
        await Member.findByIdAndDelete(id);
      } catch {
        // continue
      }
    }
    const members = memoryStore.getMembers();
    const filtered = members.filter(m => m._id.toString() !== id.toString());
    memoryStore.setMembers(filtered);
    return true;
  }
};
