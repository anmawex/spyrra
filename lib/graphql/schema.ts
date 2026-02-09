import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    phone: String
    createdAt: String!
    updatedAt: String!
    creditRequests: [CreditRequest!]!
  }

  type CreditRequest {
    id: ID!
    userId: String!
    user: User!
    amount: Float!
    interestRate: Float!
    termMonths: Int!
    status: String!
    requestDate: String!
    approvalDate: String
    createdAt: String!
    updatedAt: String!
    paymentInstallments: [PaymentInstallment!]!
  }

  type PaymentInstallment {
    id: ID!
    creditRequestId: String!
    creditRequest: CreditRequest!
    installmentNumber: Int!
    dueDate: String!
    amount: Float!
    principal: Float!
    interest: Float!
    status: String!
    paidDate: String
    createdAt: String!
    updatedAt: String!
  }

  input CreateUserInput {
    email: String!
    name: String!
    phone: String
  }

  input CreateCreditRequestInput {
    userId: String!
    amount: Float!
    interestRate: Float!
    termMonths: Int!
  }

  input UpdateCreditRequestStatusInput {
    id: String!
    status: String!
  }

  input SubmitLoanInput {
    fullName: String!
    email: String!
    phone: String!
    salary: Float!
    idDocument: String!
    idIssueDate: String!
    amount: Float!
    termMonths: Int!
  }

  type LoanDecisionResponse {
    success: Boolean!
    message: String!
    status: String!
    interestRate: Float
    monthlyPayment: Float
    totalPayment: Float
    creditRequestId: String
    paymentPlan: [PaymentInstallment]
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    creditRequests: [CreditRequest!]!
    creditRequest(id: ID!): CreditRequest
    userCreditRequests(userId: ID!): [CreditRequest!]!
    paymentInstallments(creditRequestId: ID!): [PaymentInstallment!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    createCreditRequest(input: CreateCreditRequestInput!): CreditRequest!
    updateCreditRequestStatus(input: UpdateCreditRequestStatusInput!): CreditRequest!
    submitLoanApplication(input: SubmitLoanInput!): LoanDecisionResponse!
  }
`
