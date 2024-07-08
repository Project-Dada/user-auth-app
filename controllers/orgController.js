const { Organisation, User } = require('../models');

exports.getAllOrgs = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: Organisation,
    });
    res.status(200).json({
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: {
        organisations: user.Organisations,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Failed to retrieve organisations',
      statusCode: 400,
    });
  }
};

exports.getOrgById = async (req, res) => {
  const { orgId } = req.params;
  
  try {
    const org = await Organisation.findByPk(orgId);
    
    if (!org) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'Organisation not found',
        statusCode: 404,
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Organisation retrieved successfully',
      data: {
        orgId: org.orgId,
        name: org.name,
        description: org.description,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Failed to retrieve organisation',
      statusCode: 400,
    });
  }
};

exports.createOrg = async (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(422).json({
      errors: [
        { field: 'name', message: 'Name is required' },
      ],
    });
  }
  
  try {
    const org = await Organisation.create({
      orgId: uuidv4(),
      name,
      description,
    });
    
    await req.user.addOrganisation(org);
    
    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: {
        orgId: org.orgId,
        name: org.name,
        description: org.description,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Failed to create organisation',
      statusCode: 400,
    });
  }
};

exports.addUserToOrg = async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;
  
  try {
    const org = await Organisation.findByPk(orgId);
    
    if (!org) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'Organisation not found',
        statusCode: 404,
      });
    }
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'User not found',
        statusCode: 404,
      });
    }
    
    await org.addUser(user);
    
    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Failed to add user to organisation',
      statusCode: 400,
    });
  }
};
