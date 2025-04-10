import React from 'react';
import styles from './style.module.css';

function Card({ title, onClick, buttonText }) {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <button onClick={onClick} className={styles.button}>
        {buttonText}
      </button>
    </div>
  );
}

export default Card;
