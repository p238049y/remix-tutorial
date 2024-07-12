import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import { json } from "@remix-run/node";

import appStylesHref from "./app.css?url";
import { createEmptyContact, getContacts } from "./data";
import invariant from "tiny-invariant";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

// NOTE: exportしないとUI上に表示されない
export const loader = async ({params}: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");

  const contacts = await getContacts(params.contactId);

  if (!contacts) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ contacts });
};

export const action = async () => {
  const contact = await createEmptyContact();
  return json({ contact });
};

const App = () => {
  const { contacts } = useLoaderData<typeof loader>()

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {contacts.length ? (
                <ul>
                  {contacts.map((contact) => (
                    <li key={contact.id}>
                      <Link to={`contacts/${contact.id}`}>
                        {contact.first || contact.last ? (
                          <>
                            {contact.first} {contact.last}
                          </>
                        ) : (
                          <i>No Name</i>
                        )}{" "}
                        {contact.favorite ? (
                          <span>★</span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  <i>No contacts</i>
                </p>
              )}
          </nav>
        </div>
        <div id="detail">
            <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default App;
