export const load = ({ cookies }) => {
  const token = cookies.get('jwt');
  return { token };
};