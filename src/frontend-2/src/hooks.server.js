export async function handle({ event, resolve }) {
  // TODO: Function that checks session authentication and stores in event.locals.user

  event.locals.user = null;
  return await resolve(event);
}