import { Form, json } from "@remix-run/react";
import type { FunctionComponent } from "react";

import { getContacts, type ContactRecord } from "../data";
import { LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

export const loader = async ({params}: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");

  const contacts = await getContacts(params.contactId);

  if (!contacts) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ contacts });
};

const Contact = () => {
  const contact = {
      first: "Your",
      last: "Name",
      avatar: "https://sessionize.com/image/124e-400o400o2-wHVdAuNaxi8KJrgtN3ZKci.jpg",
      twitter: "your_handle",
      notes: "Some notes",
      favorite: true,
    };
  
    return (
      <div id="contact">
        <div>
          <img
            alt={`${contact.first} ${contact.last} avatar`}
            key={contact.avatar}
            src={contact.avatar}
          />
        </div>
  
        <div>
          <h1>
            {contact.first || contact.last ? (
              <>
                {contact.first} {contact.last}
              </>
            ) : (
              <i>No Name</i>
            )}{" "}
            <Favorite contact={contact} />
          </h1>
  
          {contact.twitter ? (
            <p>
              <a
                href={`https://twitter.com/${contact.twitter}`}
              >
                {contact.twitter}
              </a>
            </p>
          ) : null}
  
          {contact.notes ? <p>{contact.notes}</p> : null}
  
          <div>
            <Form action="edit">
              <button type="submit">Edit</button>
            </Form>
  
            <Form
              action="destroy"
              method="post"
              onSubmit={(event) => {
                const response = confirm(
                  "Please confirm you want to delete this record."
                );
                if (!response) {
                  event.preventDefault();
                }
              }}
            >
              <button type="submit">Delete</button>
            </Form>
          </div>
        </div>
      </div>
  );
}

export default Contact;

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  const favorite = contact.favorite;

  return (
    <Form method="post">
      <button
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
};
