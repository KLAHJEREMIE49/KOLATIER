/** Logo « K » aux motifs traditionnels ivoiriens, animé en continu (CSS pur, aucun réseau). */
export function LogoK({ taille = 40 }: { taille?: number }) {
  return (
    <span
      className="logo-k shrink-0"
      style={{ height: taille, width: taille, borderRadius: taille * 0.34 }}
      aria-hidden="true"
    >
      <span style={{ fontSize: taille * 0.46 }}>K</span>
    </span>
  );
}
