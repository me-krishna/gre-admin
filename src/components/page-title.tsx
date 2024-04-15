const PageTitle = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <h1
      className={`text-2xl font-bold tracking-tight md:text-3xl text-slate-700 dark:text-slate-400 ${className}`}
    >
      {title}
    </h1>
  );
};
export default PageTitle;
