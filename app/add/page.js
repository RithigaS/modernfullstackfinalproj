"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./add.module.css";

// Add Formula page component
export default function AddFormulaPage() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "Algebra",
    expression: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Categories for dropdown
  const categories = [
    "Algebra",
    "Calculus",
    "Geometry",
    "Trigonometry",
    "Statistics",
    "Physics",
    "Other",
  ];

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate required fields
    if (
      !formData.title ||
      !formData.category ||
      !formData.expression ||
      !formData.description
    ) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      // Post formula to API
      await axios.post("/api/formulas", formData);
      router.push("/");
    } catch (err) {
      setError("Failed to add formula.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Add New Formula</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter formula title"
        />

        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label htmlFor="expression">LaTeX Expression:</label>
        <textarea
          id="expression"
          name="expression"
          value={formData.expression}
          onChange={handleChange}
          placeholder="Enter LaTeX expression"
          rows={4}
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
          rows={4}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? "Adding..." : "Add Formula"}
        </button>
      </form>
    </div>
  );
}
