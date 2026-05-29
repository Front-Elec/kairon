interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors cursor-pointer";
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-700",
    secondary: "bg-secondary text-white hover:bg-gray-700"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
  );
};
