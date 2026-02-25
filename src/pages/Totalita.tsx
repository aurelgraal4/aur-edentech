import React from "react"
import ProfileCard from "../components/cards/ProfileCard"
import WalletCard from "../components/cards/WalletCard"
import CoinCard from "../components/cards/CoinCard"
import ActivityCard from "../components/cards/ActivityCard"
import ForumPreviewCard from "../components/cards/ForumPreviewCard"
import JourneyCard from "../components/cards/JourneyCard"
import BadgeCard from "../components/cards/BadgeCard"

export default function Totalita() {
  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1>Totalità — Your platform snapshot</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginTop: 16 }}>
        <ProfileCard />
        <WalletCard />
        <CoinCard />
        <ActivityCard />
        <ForumPreviewCard />
        <JourneyCard />
        <BadgeCard />
      </div>
    </div>
  )
}