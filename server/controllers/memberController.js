import { MemberModel } from '../models/Member.js';
import { db } from '../config/db.js';

export const getMembers = async (req, res) => {
  try {
    const { search, status } = req.query;
    const members = await MemberModel.find({
      search,
      status,
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve members', error: error.message });
  }
};

export const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await MemberModel.findById(id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve member', error: error.message });
  }
};

export const createMember = async (req, res) => {
  try {
    const { name, email, phone, membershipDate, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Member name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email address is required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ message: 'Phone number is required.' });
    }

    const existing = await MemberModel.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: `Member with email ${email} already exists.` });
    }

    const newMember = await MemberModel.create({
      name,
      email,
      phone,
      membershipDate: membershipDate || new Date().toISOString().split('T')[0],
      status: status || 'Active',
    });

    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create member', error: error.message });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, membershipDate, status } = req.body;

    const existingMember = await MemberModel.findById(id);
    if (!existingMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ message: 'Member name cannot be empty.' });
    }
    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ message: 'Please enter a valid email address.' });
      }
      const other = await MemberModel.findOne({ email: email.trim().toLowerCase() });
      if (other && other._id !== id) {
        return res.status(400).json({ message: `Email ${email} is already in use by another member.` });
      }
    }

    const updated = await MemberModel.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      membershipDate,
      status,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update member', error: error.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const existingMember = await MemberModel.findById(id);
    if (!existingMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const transactions = db.getTransactions();
    const activeIssue = transactions.find(t => t.memberId === id && t.status === 'issued');
    if (activeIssue) {
      return res.status(400).json({
        message: 'Cannot delete member: This member currently has unreturned borrowed books. Please return all books before deleting.'
      });
    }

    await MemberModel.findByIdAndDelete(id);
    res.json({ message: 'Member deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete member', error: error.message });
  }
};
