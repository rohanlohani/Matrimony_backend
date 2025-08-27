const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Candidate = sequelize.define(
  "Candidate",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // Personal Info
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dob: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    birth_place: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    candidate_gender: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    manglik: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    gotra: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    maternal_gotra: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    // Family Info
    father_name: { type: DataTypes.STRING(100), allowNull: false },
    father_mobile: { type: DataTypes.STRING(20), allowNull: false },
    father_occupation: { type: DataTypes.STRING(100), allowNull: true },
    father_annual_income: { type: DataTypes.INTEGER, allowNull: true },
    mother_name: { type: DataTypes.STRING(100), allowNull: true },
    mother_occupation: { type: DataTypes.STRING(100), allowNull: true },
    grandfather: { type: DataTypes.STRING(100), allowNull: true },
    native_place: { type: DataTypes.STRING(100), allowNull: true },
    nationality: { type: DataTypes.STRING(50), allowNull: true },
    status_of_family: { type: DataTypes.STRING(50), allowNull: true },

    // Address & Contact
    address: { type: DataTypes.STRING(255), allowNull: true },
    country: { type: DataTypes.STRING(50), allowNull: true, defaultValue: "India" },
    state: { type: DataTypes.STRING(50), allowNull: false },
    district: { type: DataTypes.STRING(50), allowNull: true },
    pin_code: { type: DataTypes.STRING(10), allowNull: true },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    contact_no: { type: DataTypes.STRING(20), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false },

    // Physical Details
    height: { type: DataTypes.STRING(20), allowNull: false },
    body_type: { type: DataTypes.STRING(50), allowNull: false },
    complexion: { type: DataTypes.STRING(50), allowNull: false },
    blood_group: { type: DataTypes.STRING(10), allowNull: false },

    // Education & Profession
    education_detail: { type: DataTypes.STRING(100), allowNull: true },
    education: { type: DataTypes.STRING(100), allowNull: false },
    hobby: { type: DataTypes.STRING(100), allowNull: true },
    occupation: { type: DataTypes.STRING(100), allowNull: false },
    designation: { type: DataTypes.STRING(100), allowNull: true },
    annual_income: { type: DataTypes.INTEGER, allowNull: true },
    company_name: { type: DataTypes.STRING(100), allowNull: true },
    company_city: { type: DataTypes.STRING(100), allowNull: true },

    // Siblings Info
    no_unmarried_brother: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    no_unmarried_sister: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    no_married_brother: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    no_married_sister: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    // Relatives Info (optional only)
    relation: { type: DataTypes.STRING(50), allowNull: true },
    relative_name: { type: DataTypes.STRING(100), allowNull: true },
    relative_mobile_no: { type: DataTypes.STRING(20), allowNull: true },
    relative_city: { type: DataTypes.STRING(100), allowNull: true },
    relative_company_name: { type: DataTypes.STRING(100), allowNull: true },
    relative_designation: { type: DataTypes.STRING(100), allowNull: true },
    relative_company_address: { type: DataTypes.STRING(255), allowNull: true },

    // Extra
    kundali_milana: { type: DataTypes.STRING(10), allowNull: true },
    about_me: { type: DataTypes.TEXT, allowNull: false },
    image_path: { type: DataTypes.STRING(255), allowNull: true },

    // Subscription
    subscription: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "candidate",
    timestamps: false,
  }
);

module.exports = Candidate;
