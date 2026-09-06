import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import styles from "./Phone.module.css";

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
      <div className={styles.notch} aria-hidden="true" />
      <div className={styles.screen}>{children}</div>
      <div className={styles.homeIndicator} aria-hidden="true" />
    </div>
  );
}
