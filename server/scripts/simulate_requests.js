// Scratch script to simulate public form submissions and check SMTP / Notification triggers
import dotenv from "dotenv";

dotenv.config();

const API_URL = "http://localhost:5000/api";

async function testVolunteerSubmission() {
  console.log("\n--- Testing Volunteer Submission ---");
  const payload = {
    name: "John Test-Volunteer",
    email: "test.volunteer@mailtrap.io",
    phone: "9988776655",
    city: "Ahmedabad",
    qualification: "Bachelor of Computer Applications",
    availability: "weekends",
    role: "teaching",
    whyJoin: "I want to help teach underprivileged kids.",
    skills: "Coding, Mathematics",
    languages: "English, Gujarati, Hindi",
    dob: "1995-08-15",
    gender: "male",
    occupation: "Software Engineer",
    address: "123, Test Street",
    education: "graduate",
    idProofUrl: "https://example.com/id.pdf",
    state: "Gujarat",
    country: "India",
    pincode: "380001",
    experience: "2 years",
    emergencyName: "Emergency Contact",
    emergencyPhone: "9988776611",
  };

  try {
    const res = await fetch(`${API_URL}/volunteers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log(`Response Status: ${res.status}`);
    console.log("Response Body:", data);
  } catch (err) {
    console.error("Volunteer test failed:", err.message);
  }
}

async function testDonationSubmission() {
  console.log("\n--- Testing Donation Submission ---");
  const payload = {
    donorName: "John Test-Donor",
    email: "test.donor@mailtrap.io",
    phone: "9988776644",
    amount: 1500,
    panNumber: "ABCDE1234F",
    paymentId: "pay_test_123456",
    address: "123, Test Street, Ahmedabad",
    purpose: "general",
  };

  try {
    const res = await fetch(`${API_URL}/donations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log(`Response Status: ${res.status}`);
    console.log("Response Body:", data);
  } catch (err) {
    console.error("Donation test failed:", err.message);
  }
}

async function runTests() {
  // Give local server a moment if needed
  await testVolunteerSubmission();
  await testDonationSubmission();
  console.log("\nSimulation test finished!");
}

runTests();
