const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');
const { validationResult } = require('express-validator');

const resolvers = {
    Query: {
        async login(_, { input }) {
            const { username, password } = input;
            
            // Find user by username
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('User not found');
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }

            // Generate token
            const token = jwt.sign(
                { id: user.id, username: user.username },
                'your_jwt_secret',
                { expiresIn: '1h' }
            );

            return {
                token,
                user
            };
        },

        async getAllEmployees(_, __, context) {
            auth(context);
            return await Employee.find();
        },

        async getEmployeeById(_, { id }, context) {
            auth(context);
            return await Employee.findById(id);
        },

        async searchEmployees(_, { designation, department }, context) {
            auth(context);
            const query = {};
            if (designation) query.designation = designation;
            if (department) query.department = department;
            return await Employee.find(query);
        }
    },

    Mutation: {
        async signup(_, { input }) {
            const { username, email, password } = input;

            // Check if user already exists
            const existingUser = await User.findOne({ 
                $or: [{ username }, { email }] 
            });
            if (existingUser) {
                throw new Error('User already exists');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);

            // Create new user
            const user = new User({
                username,
                email,
                password: hashedPassword
            });

            const result = await user.save();

            // Generate token
            const token = jwt.sign(
                { id: result.id, username: result.username },
                'your_jwt_secret',
                { expiresIn: '1h' }
            );

            return {
                token,
                user: result
            };
        },

        async createEmployee(_, { input }, context) {
            auth(context);
            
            // Additional validation
            if (!input.email.includes('@')) {
                throw new Error('Invalid email format');
            }
            
            if (input.salary < 1000) {
                throw new Error('Salary must be at least 1000');
            }
            
            const employee = new Employee(input);
            return await employee.save();
        },

        async updateEmployee(_, { id, input }, context) {
            auth(context);
            return await Employee.findByIdAndUpdate(
                id,
                input,
                { new: true, runValidators: true }
            );
        },

        async deleteEmployee(_, { id }, context) {
            auth(context);
            await Employee.findByIdAndDelete(id);
            return true;
        }
    }
};

module.exports = resolvers; 