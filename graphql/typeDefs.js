const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        created_at: String
        updated_at: String
    }

    type Employee {
        id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String!
        designation: String!
        salary: Float!
        date_of_joining: String!
        department: String!
        employee_photo: String
        created_at: String
        updated_at: String
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    input SignupInput {
        username: String!
        email: String!
        password: String!
    }

    input LoginInput {
        username: String!
        password: String!
    }

    input EmployeeInput {
        first_name: String!
        last_name: String!
        email: String!
        gender: String!
        designation: String!
        salary: Float!
        date_of_joining: String!
        department: String!
        employee_photo: String
    }

    type Query {
        login(input: LoginInput!): AuthPayload!
        getAllEmployees: [Employee!]!
        getEmployeeById(id: ID!): Employee
        searchEmployees(designation: String, department: String): [Employee!]!
    }

    type Mutation {
        signup(input: SignupInput!): AuthPayload!
        createEmployee(input: EmployeeInput!): Employee!
        updateEmployee(id: ID!, input: EmployeeInput!): Employee!
        deleteEmployee(id: ID!): Boolean!
    }
`;

module.exports = typeDefs; 