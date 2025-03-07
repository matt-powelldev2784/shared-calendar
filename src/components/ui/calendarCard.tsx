import { format } from "date-fns";

const variantClasses = {
  default: "w-full flex flex-row gap-2 h-20 items-center rounded-md",
  pink: "bg-lightPink text-darkPink",
  green: "bg-lightGreen  text-darkGreen",
  purple: "bg-lightPurple text-darkPurple",
  blue: "bg-lightBlue text-darkBlue",
  yellow: "bg-lightYellow text-darkYellow",
};

const dateIconClasses = {
  default:
    "text-white w-12 h-12 flex flex-col items-center justify-center rounded-full ml-4 mr-2",
  pink: "bg-darkPink",
  green: "bg-darkGreen",
  purple: "bg-darkPurple",
  blue: "bg-darkBlue",
  yellow: "bg-darkYellow",
};

interface CalendarCardProps {
  entry: {
    title: string;
    description?: string;
    dateTime: Date;
  };
  variant: keyof typeof variantClasses;
}

const CalendarCard = ({ entry, variant }: CalendarCardProps) => {
  const { title, description, dateTime } = entry;
  return (
    <article className={`${variantClasses.default} ${variantClasses[variant]}`}>
      <div className={`${dateIconClasses.default} ${dateIconClasses[variant]}`}>
        <p className="h-4">{format(dateTime, "dd")}</p>
        <p>{format(dateTime, "MMM")}</p>
      </div>

      <div>
        <h3 className={"font-bold"}>{title}</h3>
        <p className={""}>{description}</p>
        <p className={""}>{format(dateTime, "dd MMM yyyy, HH:mm")}</p>
      </div>
    </article>
  );
};

export { CalendarCard };
