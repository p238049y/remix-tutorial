import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  json,
  NavLink,
  useNavigation,
  useSubmit
} from "@remix-run/react";

import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import appStylesHref from "./app.css?url";
import { createEmptyContact, getContacts } from "./data";
import invariant from "tiny-invariant";
import { useEffect, useState } from "react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

// NOTE: exportしないとUI上に表示されない
export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, q });
};

export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

const App = () => {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [query, setQuery] = useState(q || "");
  const submit = useSubmit();

  useEffect(() => {
    setQuery(q || "");
  }, [q]);

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
            <Form 
              id="search-form" 
              onChange={(event) =>
                submit(event.currentTarget)
              } 
              role="search"
            >
              <input
                aria-label="Search contacts"
                id="q"
                name="q"
                onChange={(event) =>
                  setQuery(event.currentTarget.value)
                }
                placeholder="Search"
                type="search"
                value={query}
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
                      <NavLink
                        className={({ isActive, isPending }) =>
                          isActive
                            ? "active"
                            : isPending
                            ? "pending"
                            : ""
                        }
                        to={`contacts/${contact.id}`}
                      >
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
                      </NavLink>
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
        <div 
          className={navigation.state === "loading" ? "loading" : ""}
	        id="detail"
        >
            <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default App;

