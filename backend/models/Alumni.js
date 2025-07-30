const mongoose = require("mongoose"); 

const alumniSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      ref: "User_main", // Foreign Key referencing User collection
    },
    name: { type: String, required: true },
    yearOfGraduation: { type: Number, required: true },
    programStudied: { type: String, required: true },
    linkedinUrl: { type: String, required: true },
    job: { type: String, required: true },
    sector: { type: String, required: true },
    approval_status: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "pending" 
    },

    // New Fields
    currentCompany: { type: String }, // Current Company Name
    yearsOfExperience: { type: Number }, // Years of Experience
    companyLocation: { type: String }, // Company Location
    achievements: { type: String }, // Achievements & Awards

    higherStudies: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },
    institutionName: {
      type: String,
      required: function () {
        return this.higherStudies === "Yes"; // Required only if higherStudies is "Yes"
      },
    },
    degreePursued: { 
      type: String, 
      required: function () { 
        return this.higherStudies === "Yes"; 
      } 
    }, // Degree Pursued
    specialization: { 
      type: String, 
      required: function () { 
        return this.higherStudies === "Yes"; 
      } 
    }, // Specialization
    yearOfCompletion: { 
      type: Number, 
      required: function () { 
        return this.higherStudies === "Yes"; 
      } 
    }, // Year of Completion

  },
  { timestamps: true }
);

module.exports = mongoose.model("Alumni", alumniSchema);
