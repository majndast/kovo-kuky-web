/** Static soft light behind the whole site; gives the frosted glass something to refract. */
export function Ambient() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      <div className="absolute -left-[10%] -top-[15%] h-[70vh] w-[70vw] bg-[radial-gradient(closest-side,rgba(34,197,94,0.16),transparent)]" />
      <div className="absolute -right-[15%] top-[30%] h-[80vh] w-[60vw] bg-[radial-gradient(closest-side,rgba(120,140,160,0.12),transparent)]" />
      <div className="absolute -bottom-[20%] left-[15%] h-[60vh] w-[60vw] bg-[radial-gradient(closest-side,rgba(34,197,94,0.08),transparent)]" />
    </div>
  );
}
