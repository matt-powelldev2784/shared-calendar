import LoadingSpinner from '../../assets/icons/loading.svg';

type LoadingProps = {
  classNames?: string;
  variant?: keyof typeof variants;
};

const variants = {
  default: 'h-10 w-10 animate-spin',
  sm: 'h-6 w-6 animate-spin',
};

const Loading = ({ classNames, variant }: LoadingProps) => {
  return (
    <img
      src={LoadingSpinner}
      alt="loading..."
      className={`${variant ? variants[variant] : variants.default} ${classNames}`}
    />
  );
};

export default Loading;
