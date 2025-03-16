import AddEntry from '@/components/addEntry/addEntry';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/add-entry')({
  component: AddEntryPage,
});

function AddEntryPage() {
  return (
    <section className="flex h-full w-full flex-col items-center justify-center">
      <AddEntry />
    </section>
  );
};

export default AddEntryPage;
