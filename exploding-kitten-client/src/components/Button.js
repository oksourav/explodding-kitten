function Button({ handleOnClick, label, className }) {
  return (
    <button onClick={handleOnClick} className={className}>
      {label}
    </button>
  );
}

export default Button;
