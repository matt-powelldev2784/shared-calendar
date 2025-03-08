import addCalendarEntry, { type AddCalendarEntry } from "@/db/addCalendarEntry";
import type { CalendarEntry } from "@/ts/Calendar";
import { useState } from "react";

export const AddEntry = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [ownerIds, setOwnerIds] = useState([]);
  const [calendarId, setCalendarId] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const handleAddEntry = async () => {
    const entry: AddCalendarEntry = {
      title,
      description,
      startDate,
      endDate,
      calendarId,
      subscribers,
      pendingRequests,
      ownerIds,
    };

    try {
      const entryId = await addCalendarEntry(entry);
      console.log("Entry added with ID: ", entryId);
    } catch (error) {
      console.error("Error adding entry: ", error.message);
      alert(`Error adding entry: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Add Calendar Entry</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Owner ID"
        value={ownerIds.join(",")}
        onChange={(e) => setOwnerIds(e.target.value.join(","))}
      />
      <input
        type="datetime-local"
        value={startDate.toISOString().slice(0, 16)}
        onChange={(e) => setStartDate(new Date(e.target.value))}
      />
      <input
        type="datetime-local"
        value={endDate.toISOString().slice(0, 16)}
        onChange={(e) => setEndDate(new Date(e.target.value))}
      />
      <input
        type="text"
        placeholder="Calendar ID"
        value={calendarId}
        onChange={(e) => setCalendarId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subscriber IDs (comma separated)"
        value={subscribers.join(",")}
        onChange={(e) => setSubscribers(e.target.value.split(","))}
      />
      <input
        type="text"
        placeholder="Pending Requests (comma separated)"
        value={pendingRequests.join(",")}
        onChange={(e) => setPendingRequests(e.target.value.split(","))}
      />
      <button onClick={handleAddEntry}>Add Entry</button>
    </div>
  );
};
