import LoadingSpinner from '../../assets/icons/loading.svg';

type LoadingProps = {
  classNames: string;
};

const Loading = ({ classNames }: LoadingProps) => {
  return (
    <img
      src={LoadingSpinner}
      alt="loading spinner"
      className={`${classNames} h-10 w-10 animate-spin`}
    />
  );
};

export default Loading;
