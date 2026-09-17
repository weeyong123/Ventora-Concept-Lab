import './ChubbyDips.css'

const treats = [
  ['Chocolate Covered Strawberries','https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnxB9nV_GuETsISxJx9TCCXu5uXq8ZtiSpgus70gilQxkzqaXLnXvY5-qKo2LVWmN1I7a7LpQu5ZuwNmfNYunwg8y67HQ12SxdVl1qXubYcxEuJAX09b6s9qvwbvCNnjXLsdhYA6w=w900-h1100-p-k-no','Signature Dip'],
  ['Pumpkin','https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmzuPt2WjCmOhv6YgIBrw39chCgztm1TdvgNM33G2s23GX65PUR3fR-0yvZCO4LxbGWh1qaiQvEr84-9Nlm2nwZ5zdEm_AgGSXOlJ0gQt1ITwAcoJ789TtqMza_F4CEjJzavWea=w900-h1100-p-k-no','Sweet Pick'],
  ['Strawberry','https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlCjWmAA9yy1aB5PocwYla57v8YyIXpk4_2swJYDCZk9nXQ6FyRiIv_MeDk9GbCsRLImetvCF8Ca0iW1L8rF-i-L143oAIWsllzk6D8-XOIr-1uh99nhFLsQe3cQhkXa5QC9iFq=w900-h1100-p-k-no','Sweet Berry'],
  ['Birthday Cake','https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnv2zw0IVRReA74T82lnrI6e1JmTG7oWnI8_gYrb9rBpIEkFB8YVql5-0NECwoPw0cGBUpANb7dUEeWhH39YTR-CVwrG3t586sCdn7zLko8otJX6_6BdL6HvNFum99ZBZT1cq3Z=w900-h1100-p-k-no','Crowd Favorite'],
  ['Cupcake','https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmZ6l4oqWDnyPc2oilFHLaCDdjipFCuZXE61_K7NQXtBrJvzYKgl2IQ09z63dq93aHEiwtpBEhVPmJoDNugk-Gp0OJ2AlU_KQB0I0ttKgY1MbQDJ3FhRuTLEBYOAEZGBhslOuh3=w900-h1100-p-k-no','Sweet Pick'],
  ['Champagne','https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmFwiuc_HfoBUUYjDlEAHQMWhrLYuezKBuTbdnohMJj11B4qitrxxCYknmWwBpl8PuFWVYhI_90U0gOijpRk7jxqbLrnWem0QF83q3Ey5559CKBhQDlcMTIC0aImuxcZ6u5k3sV=w900-h1100-p-k-no','Sweet Pick'],
  ['Pretzel','https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnEop1Zf25rg5E3WpOQCscQEWrOyaCOFsPI8r916di6LjpsEeuco81WDHNsHcKNzcGJGiokDyiCWIPqcGZ39GRZnStdQbVmOmX36NACkyfTrzI95blRdpjdAH4koptyfDgmekjN5w=w900-h1100-p-k-no','Sweet Pick'],
  ['Upside-Down Cake','https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlfkHD8TWh8ebGgEHjvzfD78QzUHwasam0fPAy_-DxHZWNLAg7xTPVzhwmQwKCpeCi86HeeZsgZrV4tYyC52veC3TNwrLHUxeH9tEUYDYFCOzbNJyHNn_1BFNs8NtSatLBuy4CFtg=w900-h1100-p-k-no','Caramelized'],
  ['Gingerbread House','https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkiF7fS7qbPyd6g4E3-FKYiEhWujO5_a1MkI4zzUnBvrU3_xfixRWNHNKg3-F4jpLq7XuLG3QM8fblmhGjWCTLDMrMAAsovsRlrsWlexQEKnFnhm7DrpJfwhCzGQYpizlR7fVrFVA=w900-h1100-p-k-no','Holiday Magic'],
  ['Unicorn Cake','https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkK2FmA720KbIohUhyMU675x6a_xAarxQ82_3C2ViWLyFeorHb-zbsWUVIkX5BMFMXlPQJcmuge9GCILq00N0gFZuL5upVk-prB3L_yjAL4sF2OJk24sjzvB9Qv_AQvFs53mcnN=w900-h1100-p-k-no','Pastel Dream'],
]

export default function ChubbyDips() {
  return <div className="cdx">
    <div className="cdx-top">✦ Houston Local Custom Desserts & Catering • <b>3–4 Day Lead Time</b> for Custom Orders <span>| Pick up at 1100 Louisiana St.</span></div>
    <header className="cdx-nav">
      <a className="cdx-brand" href="#home"><strong>Chubby Dips</strong><small>CUSTOM DESSERTS & CATERING</small><em>Houston, TX ♡</em></a>
      <nav><a href="#home">Home</a><a href="#menu">Menu</a><a href="#about">About</a><a href="#catering">Catering</a><a href="#contact">Contact</a></nav>
      <div className="cdx-actions"><a className="ghost" href="#menu">View Menu</a><a className="solid" href="#contact">▣ Request an Order</a></div>
    </header>

    <main>
      <section id="home" className="cdx-hero">
        <div className="cdx-sprinkle one">✦</div><div className="cdx-sprinkle two">♡</div><div className="cdx-sprinkle three">✧</div>
        <div className="cdx-hero-copy">
          <div className="cdx-kicker">🍓 CUSTOM CAKES • DESSERT TRAYS • CHOCOLATE TREATS</div>
          <h1>Desserts worth <span>making room for.</span></h1>
          <p>Custom celebration cakes, overflowing dessert trays, chocolate-drenched berries and hand-dipped specialties — freshly made in Houston, Texas.</p>
          <div className="cdx-hero-buttons"><a href="#menu">View Menu →</a><a className="outline" href="#contact">▣ Request an Order</a></div>
          <div className="cdx-trust"><div>❧<b>Made Fresh</b><small>in Houston</small></div><div>♡<b>Custom Orders</b><small>& Events</small></div><div>✦<b>Quality</b><small>Ingredients</small></div><div>◉<b>3–4 Day</b><small>Lead Time</small></div></div>
        </div>
        <div className="cdx-hero-art">
          <div className="cdx-script">Life is Sweeter Here ♡</div>
          <div className="cdx-photo-stack">
            <img className="cdx-main-cake" src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1400&q=90" alt="Celebration cake"/>
            <img className="cdx-berry-card" src="https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnxB9nV_GuETsISxJx9TCCXu5uXq8ZtiSpgus70gilQxkzqaXLnXvY5-qKo2LVWmN1I7a7LpQu5ZuwNmfNYunwg8y67HQ12SxdVl1qXubYcxEuJAX09b6s9qvwbvCNnjXLsdhYA6w=w800-h1000-p-k-no" alt="Chocolate covered strawberries"/>
            <div className="cdx-badge">🍓 FRESH BERRY DRIP • HANDCRAFTED DAILY</div>
            <div className="cdx-note">Good Desserts<br/>Happier People ♡</div>
          </div>
        </div>
      </section>

      <section id="menu" className="cdx-menu">
        <div className="cdx-menu-head"><div><small>OUR MOST LOVED TREATS</small><h2>Something Sweet<br/><i>for Every Mood.</i></h2></div><p>From rich chocolate dips to celebration cakes, every sweet is made to be remembered.</p></div>
        <div className="cdx-editorial-grid">
          {treats.map((t,i)=><article key={t[0]} className={`cdx-treat t${i+1}`}>
            <div className="cdx-tag">{t[2]}</div><img src={t[1]} alt={t[0]}/><div className="cdx-treat-info"><strong>{t[0]}</strong><span>♡</span></div>
          </article>)}
        </div>
      </section>

      <section id="catering" className="cdx-catering">
        <div className="cdx-cake-cut"><img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=90" alt="Chocolate cake"/><span>Custom Cakes for<br/>Life's Sweetest Moments ♡</span></div>
        <div className="cdx-catering-copy"><small>BIRTHDAYS • CELEBRATIONS • CORPORATE • JUST BECAUSE</small><h2>Planning<br/><i>Something Sweet?</i></h2><p>From custom cakes to dessert trays and catering, Chubby Dips makes every event a little more delicious.</p><a href="#contact">Request Catering →</a><div className="cdx-icons"><span>♨ Custom Cakes</span><span>◉ Events & Catering</span><span>◇ Birthdays</span><span>♡ Corporate Orders</span></div></div>
        <div className="cdx-polaroids"><figure><img src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=600&q=85" alt="Cupcakes"/><figcaption>Good Food<br/>Brings People Together ♡</figcaption></figure><figure><img src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=85" alt="Dessert box"/><figcaption>Desserts Make<br/>Everything Better ♡</figcaption></figure></div>
      </section>

      <section id="contact" className="cdx-contact">
        <div><h2>Visit Us ♡</h2><small>GRAB A SWEET TREAT OR PLACE A CUSTOM ORDER</small><p>● &nbsp; 1100 Louisiana St.<br/><b>Houston, Texas</b></p></div>
        <div><b>◷ Store Hours</b><p>Mon - Thurs &nbsp; 10:30am - 2pm<br/>Fri &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 10:30am - 1pm<br/>Sat - Sun &nbsp;&nbsp;&nbsp; CLOSED</p></div>
        <div><b>✉ Email Us</b><p>ChubbyDipsInfo@gmail.com</p><b>▣ Custom Orders</b><p>We are currently working on a <u>3–4 day lead time.</u></p></div>
        <div className="cdx-local">Local Desserts<br/>Brighter Days ♡</div>
      </section>
    </main>

    <footer className="cdx-footer"><div className="cdx-brand light"><strong>Chubby Dips</strong><small>CUSTOM DESSERTS & CATERING</small><em>Houston, TX ♡</em></div><div className="cdx-foot-script">Same Great Desserts.<br/>A Sweeter Tomorrow. ♡</div><nav><a href="#home">Home</a><a href="#menu">Menu</a><a href="#catering">Catering</a><a href="#contact">Contact</a></nav><span>◎ &nbsp; f</span></footer>
  </div>
}
