"use client";
import { Zap, Search } from "lucide-react";
import AnimatedGrid from "./AnimatedGrid";
import styles from "../../css/landing/data-table.module.css";
import clsx from "clsx";

export default function DataTable() {
  const tableData = [
    {
      stage: "Planning & Analysis",
      activities: "Requirements gathering, project scoping",
      traditionalCost: "5-10%",
      devGitCost: "3-5%",
      timeSaved: 40,
      impact: "Faster scoping with clear backend structure",
    },
    {
      stage: "Design",
      activities: "UX/UI design, wireframing, prototyping",
      traditionalCost: "10-15%",
      devGitCost: "10-15%",
      timeSaved: 0,
      impact: "Frontend design remains unchanged",
    },
    {
      stage: "Development",
      activities: "Coding (backend + frontend), database setup",
      traditionalCost: "50-60%",
      devGitCost: "25-30%",
      timeSaved: 50,
      impact: "Backend generated instantly, focus on frontend",
      isDevelopment: true,
    },
    {
      stage: "Testing & QA",
      activities: "Unit tests, bug fixing, security assurance",
      traditionalCost: "15-20%",
      devGitCost: "10-12%",
      timeSaved: 35,
      impact: "Pre-tested backend components reduce QA time",
      isTesting: true,
    },
    {
      stage: "Launch & Deployment",
      activities: "Deployment to production, rollout support",
      traditionalCost: "5-10%",
      devGitCost: "3-5%",
      timeSaved: 40,
      impact: "Docker support enables faster deployment",
    },
    {
      stage: "Maintenance",
      activities: "Ongoing updates, feature enhancements",
      traditionalCost: "10-20%",
      devGitCost: "8-15%",
      timeSaved: 25,
      impact: "Clean, documented code reduces maintenance overhead",
    },
  ];

  return (
    <AnimatedGrid className={styles.tableSection}>
      <div className={`${styles.tableContainer} sectionContainer`}>
        <div className={styles.tableHeader}>
          <h2 className={clsx(styles.title, "title")}>
            Project Development Breakdown
          </h2>
          <p className={styles.subtitle}>
            Traditional approach vs Dev-Git enhanced workflow
          </p>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Development Stage</th>
                <th>Key Activities</th>
                <th>Traditional Cost</th>
                <th>With Dev-Git</th>
                <th>Time Saved</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td className={styles.stageCell}>
                    {row.isDevelopment && (
                      <Zap className={styles.devIcon} size={16} />
                    )}
                    {row.isTesting && (
                      <Search className={styles.testIcon} size={16} />
                    )}
                    <span className={styles.stageName}>{row.stage}</span>
                  </td>
                  <td className={styles.activitiesCell}>{row.activities}</td>
                  <td className={styles.costCell}>{row.traditionalCost}</td>
                  <td className={styles.devGitCell}>{row.devGitCost}</td>
                  <td className={styles.timeSavedCell}>
                    <div className={styles.progressWrapper}>
                      <div className={styles.progressBar}></div>
                      <span className={styles.percentageText}>
                        {row.timeSaved}%
                      </span>
                    </div>
                  </td>
                  <td className={styles.impactCell}>{row.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.mobileCardsContainer}>
          {tableData.map((row, index) => (
            <div key={index} className={styles.mobileCard}>
              <div className={styles.cardHeader}>
                <div className={clsx(styles.stageTitle, "title")}>
                  {row.isDevelopment && (
                    <Zap className={styles.devIcon} size={18} />
                  )}
                  {row.isTesting && (
                    <Search className={styles.testIcon} size={18} />
                  )}
                  <h3>{row.stage}</h3>
                </div>
                <div className={styles.timeSavedBadge}>
                  <div className={styles.progressWrapper}>
                    <div className={styles.progressBar}></div>
                    <span className={styles.percentageText}>
                      {row.timeSaved}%
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardSection}>
                  <span className={styles.cardLabel}>Key Activities</span>
                  <p className={styles.cardValue}>{row.activities}</p>
                </div>

                <div className={styles.costComparison}>
                  <div className={styles.costItem}>
                    <span className={styles.costLabel}>Traditional</span>
                    <span className={styles.costValue}>
                      {row.traditionalCost}
                    </span>
                  </div>
                  <div className={styles.costArrow}>→</div>
                  <div className={styles.costItem}>
                    <span className={styles.costLabel}>With Dev-Git</span>
                    <span className={styles.costValue}>{row.devGitCost}</span>
                  </div>
                </div>

                <div className={styles.cardSection}>
                  <span className={styles.cardLabel}>Impact</span>
                  <p className={styles.cardValue}>{row.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.bottomSection}>
          <h3 className={clsx(styles.bottomTitle, "title")}>
            Bottom Line Impact
          </h3>
          <div className={styles.comparisonCards}>
            <div className={styles.traditionCard}>
              <h4>Traditional Project</h4>
              <p>4-6 months development cycle</p>
            </div>
            <div className={styles.devGitCard}>
              <h4>With Dev-Git</h4>
              <p>2-3 months development cycle</p>
            </div>
          </div>
          <div className={styles.savingsHighlight}>
            Save 30-50% of your total development budget
          </div>
        </div>
      </div>
    </AnimatedGrid>
  );
}
