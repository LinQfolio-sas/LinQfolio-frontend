import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import styles from "./Phone.module.css";

/* L'écran reçoit une capture de l'application. La Dynamic Island et la barre
   d'accueil sont dans la capture elle-même : le châssis n'en dessine pas. */
export default function Phone({
  children,
  className,
  style,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className ? `${styles.phone} ${className}` : styles.phone}
      style={style}
      {...rest}
    >
      <div className={styles.screen}>{children}</div>
    </div>
  );
}
