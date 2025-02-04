export function GET(request: Request) {
  console.log(request);
  return new Response('Hello World GET!');
}

export function DELETE(request: Request) {
  console.log(request);
  return new Response('Hello World DELETE!');
}
