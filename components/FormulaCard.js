"use client";

import Link from "next/link";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import styles from "./FormulaCard.module.css";

export default function FormulaCard({ formula, onDelete }) {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this formula?")) {
      onDelete(formula._id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>{formula.title}</h3>
          <span className={styles.category}>{formula.category}</span>
        </div>

        <div className={styles.formulaDisplay}>
          <BlockMath math={formula.expression} />
        </div>

        <p className={styles.description}>{formula.description}</p>

        <div className={styles.cardFooter}>
          <span className={styles.date}>
            Created: {formatDate(formula.createdAt)}
          </span>

          <div className={styles.actions}>
            <Link href={`/view/${formula._id}`} className={styles.viewBtn}>
              View
            </Link>
            <Link href={`/edit/${formula._id}`} className={styles.editBtn}>
              Edit
            </Link>
            <button onClick={handleDelete} className={styles.deleteBtn}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
