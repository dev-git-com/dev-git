import { useEffect, useRef, useState } from "react";
import styles from "../css/AnimatedNetworkNodes.module.css";

interface NodeType {
  x: number;
  y: number;
  type: "primary" | "secondary" | "node";
}

interface NodeInstance {
  element: HTMLDivElement;
  x: number;
  y: number;
  side: "left" | "right";
  container: HTMLDivElement;
}

const AnimatedNetworkNodes: React.FC = () => {
  const networkLeftRef = useRef<HTMLDivElement>(null);
  const networkRightRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !networkLeftRef.current || !networkRightRef.current)
      return;

    const networkViz = new AnimatedNetworkNodesClass(
      networkLeftRef.current,
      networkRightRef.current
    );

    return () => {
      // Cleanup particles
      document.querySelectorAll(".particle").forEach((particle) => {
        particle.remove();
      });
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    // Mouse interaction effect
    const handleMouseMove = (e: MouseEvent) => {
      const nodes = document.querySelectorAll(`.${styles.node}`);
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      nodes.forEach((node) => {
        const rect = (node as HTMLElement).getBoundingClientRect();
        const nodeX = rect.left + rect.width / 2;
        const nodeY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
          Math.pow(mouseX - nodeX, 2) + Math.pow(mouseY - nodeY, 2)
        );

        if (distance < 100) {
          const intensity = 1 - distance / 100;
          (node as HTMLElement).style.transform = `scale(${
            1 + intensity * 0.3
          })`;
        } else {
          (node as HTMLElement).style.transform = "scale(1)";
        }
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isClient]);

  if (!isClient) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* <div className={styles.title}>NETWORK VISUALIZATION</div>
      <div className={styles.subtitle}>DISTRIBUTED DEVELOPMENT</div> */}

      <div className={styles.network}>
        <div className={styles.networkLeft} ref={networkLeftRef}></div>
        <div className={styles.centerText}>
          <span className="text-blue-700/60">{"dev"}</span>
          <span className="text-white/60">{" > "}</span>
          <span className="text-amber-600/60">{"git"}</span>
          <sup className="text-slate-600/50">
            <em>{" alpha "}</em>
          </sup>
        </div>
        <div className={styles.networkRight} ref={networkRightRef}></div>
      </div>
    </div>
  );
};

class AnimatedNetworkNodesClass {
  private networkLeft: HTMLDivElement;
  private networkRight: HTMLDivElement;
  private nodes: NodeInstance[] = [];

  constructor(networkLeft: HTMLDivElement, networkRight: HTMLDivElement) {
    this.networkLeft = networkLeft;
    this.networkRight = networkRight;
    this.init();
  }

  private init() {
    this.createNodes();
    this.createConnections();
    this.createParticles();
  }

  private createNodes() {
    // Left network nodes (dev environment)
    const leftNodes: NodeType[] = [
      { x: 150, y: 100, type: "primary" },
      { x: 100, y: 180, type: "secondary" },
      { x: 200, y: 180, type: "secondary" },
      { x: 50, y: 250, type: "node" },
      { x: 150, y: 280, type: "node" },
      { x: 250, y: 250, type: "node" },
      { x: 120, y: 350, type: "node" },
      { x: 80, y: 450, type: "node" },
    ];

    // Right network nodes (git repository)
    const rightNodes: NodeType[] = [
      { x: 150, y: 120, type: "primary" },
      { x: 80, y: 200, type: "secondary" },
      { x: 220, y: 200, type: "secondary" },
      { x: 50, y: 280, type: "node" },
      { x: 120, y: 320, type: "node" },
      { x: 250, y: 280, type: "node" },
      { x: 180, y: 380, type: "node" },
      { x: 200, y: 460, type: "node" },
    ];

    // Create left network nodes
    leftNodes.forEach((pos, index) => {
      const node = document.createElement("div");
      node.className = `${styles.node} ${styles[pos.type]}`;
      node.style.cssText = `
        position: absolute;
        left: ${pos.x}px;
        top: ${pos.y}px;
        animation-delay: ${index * 0.15}s;
      `;

      this.networkLeft.appendChild(node);
      this.nodes.push({
        element: node,
        x: pos.x + 10,
        y: pos.y + 10,
        side: "left",
        container: this.networkLeft,
      });
    });

    rightNodes.forEach((pos, index) => {
      const node = document.createElement("div");
      node.className = `${styles.node} ${styles[pos.type]}`;
      // Mirror x coordinate for right container:
      const mirroredX = 300 - pos.x;
      node.style.cssText = `
        position: absolute;
        left: ${mirroredX}px;
        top: ${pos.y}px;
        animation-delay: ${index * 0.15}s;
      `;

      this.networkRight.appendChild(node);
      this.nodes.push({
        element: node,
        x: mirroredX + 10, // center offset
        y: pos.y + 10,
        side: "right",
        container: this.networkRight,
      });
    });
  }

  private createConnections() {
    // Left network connections
    const leftConnections = [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 4],
      [2, 5],
      [4, 6],
      [3, 7],
      [6, 7],
    ];

    // Right network connections
    const rightConnections = [
      [8, 9],
      [8, 10],
      [9, 11],
      [9, 12],
      [10, 12],
      [10, 13],
      [12, 14],
      [11, 15],
      [14, 15],
    ];

    leftConnections.forEach((conn, index) => {
      const [startIdx, endIdx] = conn;
      const startNode = this.nodes[startIdx];
      const endNode = this.nodes[endIdx];

      this.createConnection(startNode, endNode, index, startNode.container);
    });

    rightConnections.forEach((conn, index) => {
      const [startIdx, endIdx] = conn;
      const startNode = this.nodes[startIdx];
      const endNode = this.nodes[endIdx];

      this.createConnection(
        startNode,
        endNode,
        index + leftConnections.length,
        startNode.container
      );
    });
  }

  private createConnection(
    startNode: NodeInstance,
    endNode: NodeInstance,
    index: number,
    container: HTMLDivElement
  ) {
    const connection = document.createElement("div");
    connection.className = `${styles.connection} ${
      index % 2 === 0 ? "" : styles.reverse
    }`;

    const dx = endNode.x - startNode.x;
    const dy = endNode.y - startNode.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    connection.style.cssText = `
      position: absolute;
      width: ${length}px;
      left: ${startNode.x}px;
      top: ${startNode.y}px;
      transform: rotate(${angle}deg);
      animation-delay: ${index * 0.1}s;
    `;

    container.appendChild(connection);
  }

  private createParticles() {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}vw;
        animation-delay: ${Math.random() * 8}s;
        animation-duration: ${8 + Math.random() * 4}s;
      `;

      document.body.appendChild(particle);
    }
  }
}

export default AnimatedNetworkNodes;
