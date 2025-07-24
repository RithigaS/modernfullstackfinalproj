"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import FormulaCard from "@/components/FormulaCard";
import SearchFilter from "@/components/SearchFilter";
import styles from "./page.module.css";

// Home page component - displays all formulas
export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formulas, setFormulas] = useState([]);
  const [filteredFormulas, setFilteredFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch formulas when component mounts
  useEffect(() => {
    if (session) {
      fetchFormulas();
    }
  }, [session]);

  // Fetch all formulas from API
  const fetchFormulas = async (category = "", search = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category && category !== "All") params.append("category", category);
      if (search) params.append("search", search);

      const response = await axios.get(`/api/formulas?${params}`);
      setFormulas(response.data.formulas);
      setFilteredFormulas(response.data.formulas);
      setError("");
    } catch (error) {
      console.error("Error fetching formulas:", error);
      setError("Failed to load formulas");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    fetchFormulas("", searchTerm);
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    fetchFormulas(category, "");
  };

  // Handle delete formula
  const handleDeleteFormula = async (formulaId) => {
    try {
      await axios.delete(`/api/formulas/${formulaId}`);
      // Remove deleted formula from state
      setFormulas(formulas.filter((f) => f._id !== formulaId));
      setFilteredFormulas(filteredFormulas.filter((f) => f._id !== formulaId));
    } catch (error) {
      console.error("Error deleting formula:", error);
      setError("Failed to delete formula");
    }
  };

  // Show loading while checking authentication
  if (status === "loading") {
    return <div className="loading">Loading...</div>;
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Math Formulas</h1>
        <Link href="/add" className="btn btn-primary">
          ➕ Add New Formula
        </Link>
      </div>

      <SearchFilter
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
      />

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading formulas...</div>
      ) : filteredFormulas.length === 0 ? (
        <div className="empty-state">
          <h3>No formulas found</h3>
          <p>Start building your math formula collection!</p>
          <Link href="/add" className="btn btn-primary">
            Add Your First Formula
          </Link>
        </div>
      ) : (
        <div className="formulas-grid">
          {filteredFormulas.map((formula) => (
            <FormulaCard
              key={formula._id}
              formula={formula}
              onDelete={handleDeleteFormula}
            />
          ))}
        </div>
      )}
    </div>
  );
}
