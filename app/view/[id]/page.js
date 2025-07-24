"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
// Correct the import path for the CSS module
import styles from "../view.module.css";

// View Formula page component
export default function ViewFormulaPage() {
  const params = useParams();
  const router = useRouter();
  const formulaId = params.id;

  const [formula, setFormula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch formula data on mount
  useEffect(() => {
    const fetchFormula = async () => {
      try {
        const response = await axios.get(`/api/formulas/${formulaId}`);
        setFormula(response.data.formula);
        setError("");
      } catch (err) {
        setError("Failed to load formula.");
      } finally {
        setLoading(false);
      }
    };

    fetchFormula();
  }, [formulaId]);

  if (loading) {
    return <div className={styles.container}>Loading formula...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  if (!formula) {
    return <div className={styles.container}>Formula not found.</div>;
  }

  return (
    <div className={styles.container}>
      <h1>{formula.title}</h1>
      <span className={styles.category}>{formula.category}</span>
      <div className={styles.expression}>
        <BlockMath math={formula.expression} />
      </div>
      <p className={styles.description}>{formula.description}</p>
      <button onClick={() => router.back()} className={styles.backBtn}>
        ← Back
      </button>
    </div>
  );
}
