// eventService.mjs
const BASE_URL = "http://localhost:5000/api/events";

export function getEventTypes() {
  return [
    { id: 'conference', title: 'Conference' },
    { id: 'seminar', title: 'Seminar' },
    { id: 'workshop', title: 'Workshop' },
    { id: 'webinar', title: 'Webinar' },
    { id: 'meetup', title: 'Meetup' },
    { id: 'other', title: 'Other' },
  ];
}

export async function insertEvent(event) {
  try {
      // ✅ Ensure eventType is set correctly
      if (event.eventType === "other" && event.customEventType) {
          event.eventType = event.customEventType;
      }
      delete event.customEventType; // Remove unnecessary field
      console.log("📌 Sending Event Data:", event);

      // ✅ Ensure event.date is valid
      let formattedDate = null;
      if (event.date) {
          const parsedDate = new Date(event.date);
          if (!isNaN(parsedDate.getTime())) {
              formattedDate = parsedDate.toISOString();
          } else {
              console.error("❌ Invalid Date:", event.date);
          }
      } else {
          console.warn("⚠ No date provided, setting to null");
      }

      // ✅ Create FormData object
      const eventData = new FormData();
      eventData.append("title", event.title || "Untitled Event");
      eventData.append("description", event.description || "");
      eventData.append("date", formattedDate);
      eventData.append("location", event.location || "");
      eventData.append("eventType", event.eventType || "General");
      eventData.append("passedOutYear", event.passedOutYear || "");

      // ✅ Upload file to Cloudinary first, then append URL
      if (event.attachment) {
          console.log("file is here");
          
          eventData.append("attachment", event.attachment);
      }

      console.log("📌 Final FormData before sending:", Array.from(eventData.entries())); // Debugging

      const response = await fetch(BASE_URL, {
          method: "POST",
          body: event, // ✅ Send FormData directly (no JSON.stringify)
      });

      if (!response.ok) {
          const errorData = await response.json();
        
      }

      return await response.json();
  } catch (error) {
      console.error("❌ Error inserting event:", error);
      return null;
  }
}


export async function updateEvent(event,id) {
  try {
    console.log("Updating Event:", Object.fromEntries(event));

    // Create FormData for the update request
    const eventData = new FormData();
    eventData.append("title", event.title || "Untitled Event");
    eventData.append("description", event.description || "");
    eventData.append("date", event.date || "");
    eventData.append("location", event.location || "");
    eventData.append("eventType", event.eventType || "General");
    eventData.append("passedOutYear", event.passedOutYear || "");

    // Append the attachment if it’s a File or a URL string
    if (event.attachment instanceof File) {
      eventData.append("attachment", event.attachment);
    } else if (event.attachment) {
      eventData.append("attachment", event.attachment);
    }
   
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: event,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Update error: ${errorData.message}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating event:", error);
    return null;
  }
}

export async function deleteEvent(eventId) {
  console.log("Sending DELETE request for event:", eventId);
  const response = await fetch(`${BASE_URL}/${eventId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to delete event:", response.status, response.statusText, errorText);
  }
}

export async function deleteEventAttachment(eventId) {
  const resp = await fetch(`${BASE_URL}/${eventId}/attachment`, {
    method: "DELETE"
  });
  if (!resp.ok) {
    console.error("Failed to delete attachment", await resp.text());
    throw new Error("Could not delete attachment");
  }
  return await resp.json();
}

export async function getAllEvents() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch events");
    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function getEventById(eventId) {
  try {
    const response = await fetch(`${BASE_URL}/${eventId}`);
    if (!response.ok) throw new Error("Failed to fetch event by ID");
    return await response.json();
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    return null;
  }
}
// eventService.mjs