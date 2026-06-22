import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import { Smile, Search, Check, Heart } from "lucide-react";

const emojiCategories = {
  "Smileys & Emotion": [
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
    "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙",
    "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫",
    "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬",
    "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢",
    "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "🥸",
    "😎", "🤓", "🧐", "😕", "😟", "🙁", "😮", "😯", "😲", "😳",
    "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖",
    "😣", "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬",
    "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽",
  ],
  "People & Body": [
    "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞",
    "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍",
    "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝",
    "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂",
    "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁️", "👅",
    "👄", "👶", "🧒", "👦", "👧", "🧑", "👱", "👨", "🧔", "👩",
    "🧓", "👴", "👵", "🙍", "🙎", "🙅", "🙆", "💁", "🙋", "🧏",
    "🙇", "🤦", "🤷", "👮", "🕵️", "💂", "🥷", "👷", "🤴", "👸",
    "👳", "👲", "🧕", "🤵", "👰", "🤰", "🤱", "👼", "🎅", "🤶",
  ],
  "Animals & Nature": [
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨",
    "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊",
    "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉",
    "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🪱", "🐛", "🦋", "🐌",
    "🐞", "🐜", "🪰", "🪲", "🪳", "🦟", "🦗", "🕷️", "🦂", "🐢",
    "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡",
    "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓",
    "🦍", "🦧", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🐃",
    "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌", "🐕",
  ],
  "Food & Drink": [
    "🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🥭", "🍎", "🍏",
    "🍐", "🍑", "🍒", "🍓", "🫐", "🥝", "🍅", "🫒", "🥥", "🥑",
    "🍆", "🥔", "🥕", "🌽", "🌶️", "🫑", "🥒", "🥬", "🥦", "🧄",
    "🧅", "🍄", "🥜", "🌰", "🍞", "🥐", "🥖", "🫓", "🥨", "🥯",
    "🥞", "🧇", "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟", "🍕",
    "🌭", "🥪", "🌮", "🌯", "🫔", "🥙", "🧆", "🥚", "🍳", "🥘",
    "🍲", "🫕", "🥣", "🥗", "🍿", "🧈", "🧂", "🥫", "🍱", "🍘",
    "🍙", "🍚", "🍛", "🍜", "🍝", "🍠", "🍢", "🍣", "🍤", "🍥",
    "🥮", "🍡", "🥟", "🥠", "🥡", "🦀", "🦞", "🦐", "🦑", "🦪",
  ],
  "Activities": [
    "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱",
    "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳",
    "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷",
    "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂", "🏋️", "🤼", "🤸", "⛹️",
    "🤺", "🤾", "🏌️", "🏇", "🧘", "🏄", "🏊", "🤽", "🚣", "🧗",
    "🚵", "🚴", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🏵️", "🎗️",
    "🎫", "🎟️", "🎪", "🤹", "🎭", "🩰", "🎨", "🎬", "🎤", "🎧",
    "🎼", "🎹", "🥁", "🪘", "🎷", "🎺", "🎸", "🪕", "🎻", "🪗",
    "🎲", "♟️", "🎯", "🎳", "🎮", "🎰", "🧩", "🎪", "🎭", "🎨",
  ],
  "Travel & Places": [
    "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐",
    "🛻", "🚚", "🚛", "🚜", "🦯", "🦽", "🦼", "🛴", "🚲", "🛵",
    "🏍️", "🛺", "🚨", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", "🚟",
    "🚃", "🚋", "🚞", "🚝", "🚄", "🚅", "🚈", "🚂", "🚆", "🚇",
    "🚊", "🚉", "✈️", "🛫", "🛬", "🛩️", "💺", "🛰️", "🚀", "🛸",
    "🚁", "🛶", "⛵", "🚤", "🛥️", "🛳️", "⛴️", "🚢", "⚓", "⛽",
    "🚧", "🚦", "🚥", "🚏", "🗺️", "🗿", "🗽", "🗼", "🏰", "🏯",
    "🏟️", "🎡", "🎢", "🎠", "⛲", "⛱️", "🏖️", "🏝️", "🏜️", "🌋",
    "⛰️", "🏔️", "🗻", "🏕️", "⛺", "🏠", "🏡", "🏘️", "🏚️", "🏗️",
  ],
  "Objects": [
    "⌚", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️",
    "🗜️", "💽", "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥",
    "📽️", "🎞️", "📞", "☎️", "📟", "📠", "📺", "📻", "🎙️", "🎚️",
    "🎛️", "🧭", "⏱️", "⏲️", "⏰", "🕰️", "⌛", "⏳", "📡", "🔋",
    "🔌", "💡", "🔦", "🕯️", "🪔", "🧯", "🛢️", "💸", "💵", "💴",
    "💶", "💷", "🪙", "💰", "💳", "💎", "⚖️", "🪜", "🧰", "🪛",
    "🔧", "🔨", "⚒️", "🛠️", "⛏️", "🪚", "🔩", "⚙️", "🪤", "🧲",
    "🔫", "💣", "🧨", "🪓", "🔪", "🗡️", "⚔️", "🛡️", "🚬", "⚰️",
    "🪦", "⚱️", "🏺", "🔮", "📿", "🧿", "🪬", "💈", "⚗️", "🔭",
  ],
  "Symbols": [
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
    "❤️‍🔥", "❤️‍🩹", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟",
    "☮️", "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️",
    "🛐", "⛎", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏",
    "♐", "♑", "♒", "♓", "🆔", "⚛️", "🉑", "☢️", "☣️", "📴",
    "📳", "🈶", "🈚", "🈸", "🈺", "🈷️", "✴️", "🆚", "💮", "🉐",
    "㊙️", "㊗️", "🈴", "🈵", "🈹", "🈲", "🅰️", "🅱️", "🆎", "🆑",
    "🅾️", "🆘", "❌", "⭕", "🛑", "⛔", "📛", "🚫", "💯", "💢",
    "♨️", "🚷", "🚯", "🚳", "🚱", "🔞", "📵", "🚭", "❗", "❕",
  ],
  "Flags": [
    "🏁", "🚩", "🎌", "🏴", "🏳️", "🏳️‍🌈", "🏳️‍⚧️", "🏴‍☠️", "🇦🇨", "🇦🇩",
    "🇦🇪", "🇦🇫", "🇦🇬", "🇦🇮", "🇦🇱", "🇦🇲", "🇦🇴", "🇦🇶", "🇦🇷", "🇦🇸",
    "🇦🇹", "🇦🇺", "🇦🇼", "🇦🇽", "🇦🇿", "🇧🇦", "🇧🇧", "🇧🇩", "🇧🇪", "🇧🇫",
    "🇧🇬", "🇧🇭", "🇧🇮", "🇧🇯", "🇧🇱", "🇧🇲", "🇧🇳", "🇧🇴", "🇧🇶", "🇧🇷",
    "🇧🇸", "🇧🇹", "🇧🇻", "🇧🇼", "🇧🇾", "🇧🇿", "🇨🇦", "🇨🇨", "🇨🇩", "🇨🇫",
    "🇨🇬", "🇨🇭", "🇨🇮", "🇨🇰", "🇨🇱", "🇨🇲", "🇨🇳", "🇨🇴", "🇨🇵", "🇨🇷",
    "🇨🇺", "🇨🇻", "🇨🇼", "🇨🇽", "🇨🇾", "🇨🇿", "🇩🇪", "🇩🇬", "🇩🇯", "🇩🇰",
    "🇩🇲", "🇩🇴", "🇩🇿", "🇪🇦", "🇪🇨", "🇪🇪", "🇪🇬", "🇪🇭", "🇪🇷", "🇪🇸",
    "🇪🇹", "🇪🇺", "🇫🇮", "🇫🇯", "🇫🇰", "🇫🇲", "🇫🇴", "🇫🇷", "🇬🇦", "🇬🇧",
  ],
};

export default function EmojiPicker() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Smileys & Emotion");
  const [copiedEmoji, setCopiedEmoji] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("emojiFavorites");
    return saved ? JSON.parse(saved) : [];
  });

  const filteredEmojis = useMemo(() => {
    const emojis = emojiCategories[selectedCategory] || [];
    if (!searchQuery) return emojis;
    
    return emojis.filter((emoji) => {
      const query = searchQuery.toLowerCase();
      return emoji.toLowerCase().includes(query);
    });
  }, [selectedCategory, searchQuery]);

  const copyToClipboard = async (emoji) => {
    try {
      await navigator.clipboard.writeText(emoji);
      setCopiedEmoji(emoji);
      setTimeout(() => setCopiedEmoji(null), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toggleFavorite = (emoji) => {
    const newFavorites = favorites.includes(emoji)
      ? favorites.filter((e) => e !== emoji)
      : [...favorites, emoji];
    setFavorites(newFavorites);
    localStorage.setItem("emojiFavorites", JSON.stringify(newFavorites));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1020] via-[#091224] to-[#050816] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Emoji Picker</h1>
          <p className="text-gray-400">
            Find and copy emojis quickly
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search emojis..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:border-blue-500/50 focus:outline-none transition-colors"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(emojiCategories).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          ))}
          {favorites.length > 0 && (
            <button
              onClick={() => setSelectedCategory("Favorites")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                selectedCategory === "Favorites"
                  ? "bg-pink-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              <Heart size={16} />
              Favorites
            </button>
          )}
        </div>

        {/* Emoji Grid */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {selectedCategory === "Favorites" ? "Favorites" : selectedCategory}
            </h2>
            <span className="text-sm text-gray-400">
              {selectedCategory === "Favorites" ? favorites.length : filteredEmojis.length} emojis
            </span>
          </div>

          {(selectedCategory === "Favorites" ? favorites : filteredEmojis).length > 0 ? (
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2">
              {(selectedCategory === "Favorites" ? favorites : filteredEmojis).map((emoji, idx) => (
                <button
                  key={`${emoji}-${idx}`}
                  onClick={() => copyToClipboard(emoji)}
                  className="relative group aspect-square flex items-center justify-center text-2xl bg-white/5 hover:bg-white/10 rounded-xl transition-all hover:scale-110"
                  title="Click to copy"
                >
                  {emoji}
                  {copiedEmoji === emoji && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500/80 rounded-xl">
                      <Check size={20} />
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(emoji);
                    }}
                    className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart
                      size={14}
                      className={favorites.includes(emoji) ? "fill-pink-500 text-pink-500" : "text-gray-400"}
                    />
                  </button>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Smile size={48} className="mx-auto mb-4 opacity-50" />
              <p>
                {searchQuery
                  ? "No emojis found matching your search"
                  : "No favorites yet. Click the heart icon on emojis to add them here!"}
              </p>
            </div>
          )}
        </div>

        {/* Recently Copied */}
        {copiedEmoji && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center gap-3">
            <span className="text-3xl">{copiedEmoji}</span>
            <span className="text-green-400">Copied to clipboard!</span>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <h3 className="text-sm font-semibold text-blue-400 mb-2">Tips</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Click on any emoji to copy it to your clipboard</li>
            <li>• Use the search bar to find specific emojis</li>
            <li>• Click the heart icon to add emojis to your favorites</li>
            <li>• Favorites are saved locally in your browser</li>
          </ul>
        </div>
      </div>
    </div>
  );
}