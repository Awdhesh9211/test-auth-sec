const TermsAndConditions = require('../models/termAndCondition.js');

// Get the latest terms and conditions
const getTerms = async (req, res) => {
  try {
    const terms = await TermsAndConditions.findOne().sort({ createdAt: -1 });
    
    if (!terms) {
      return res.status(404).json({ 
        success: false, 
        message: 'No terms and conditions found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: terms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create new terms and conditions
const createTerms = async (req, res) => {
  try {
    const terms = await TermsAndConditions.create(req.body);
    
    res.status(201).json({
      success: true,
      data: terms
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid data provided',
      error: error.message
    });
  }
};

// Update terms and conditions
const updateTerms = async (req, res) => {
  try {
    const terms = await TermsAndConditions.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!terms) {
      return res.status(404).json({ 
        success: false, 
        message: 'Terms not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: terms
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Update failed',
      error: error.message
    });
  }
};

// Add a term to termList
const addTerm = async (req, res) => {
  try {
    const { id } = req.params;
    const { term, conditions } = req.body;
    
    if (!term) {
      return res.status(400).json({
        success: false,
        message: 'Term is required'
      });
    }
    
    const terms = await TermsAndConditions.findById(id);
    
    if (!terms) {
      return res.status(404).json({ 
        success: false, 
        message: 'Terms not found' 
      });
    }
    
    terms.termList.push({ term, conditions: conditions || [] });
    await terms.save();
    
    res.status(200).json({
      success: true,
      data: terms
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to add term',
      error: error.message
    });
  }
};

// Remove a term from termList
const removeTerm = async (req, res) => {
  try {
    const { id, termId } = req.params;
    
    const terms = await TermsAndConditions.findById(id);
    
    if (!terms) {
      return res.status(404).json({ 
        success: false, 
        message: 'Terms not found' 
      });
    }
    
    terms.termList = terms.termList.filter(item => item._id.toString() !== termId);
    await terms.save();
    
    res.status(200).json({
      success: true,
      data: terms
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to remove term',
      error: error.message
    });
  }
};

// Add a condition to a term
const addCondition = async (req, res) => {
  try {
    const { id, termId } = req.params;
    const { condition } = req.body;
    
    if (!condition) {
      return res.status(400).json({
        success: false,
        message: 'Condition is required'
      });
    }
    
    const terms = await TermsAndConditions.findById(id);
    
    if (!terms) {
      return res.status(404).json({ 
        success: false, 
        message: 'Terms not found' 
      });
    }
    
    const termIndex = terms.termList.findIndex(item => item._id.toString() === termId);
    
    if (termIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Term not found' 
      });
    }
    
    terms.termList[termIndex].conditions.push(condition);
    await terms.save();
    
    res.status(200).json({
      success: true,
      data: terms
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to add condition',
      error: error.message
    });
  }
};

// Remove a condition from a term
const removeCondition = async (req, res) => {
  try {
    const { id, termId, conditionIndex } = req.params;
    
    const terms = await TermsAndConditions.findById(id);
    
    if (!terms) {
      return res.status(404).json({ 
        success: false, 
        message: 'Terms not found' 
      });
    }
    
    const termIndex = terms.termList.findIndex(item => item._id.toString() === termId);
    
    if (termIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Term not found' 
      });
    }
    
    if (conditionIndex >= terms.termList[termIndex].conditions.length || conditionIndex < 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Condition not found' 
      });
    }
    
    terms.termList[termIndex].conditions.splice(conditionIndex, 1);
    await terms.save();
    
    res.status(200).json({
      success: true,
      data: terms
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to remove condition',
      error: error.message
    });
  }
};
module.exports={addTerm,createTerms,getTerms,updateTerms,removeTerm,removeCondition,removeTerm,addCondition};