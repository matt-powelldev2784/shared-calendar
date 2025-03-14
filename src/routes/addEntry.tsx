import AddEntry from '@/components/addEntry/addEntry';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/addEntry')({
  component: AddEntry,
});

const AddEntryPage = () => {
  return (
    <section className="flex h-full w-full flex-col items-center justify-center">
      <AddEntry />
    </section>
  );
};

export default AddEntryPage;
