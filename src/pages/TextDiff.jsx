import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import { FileDiff, ArrowRight, RefreshCw } from "lucide-react";

export default function TextDiff() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [viewMode, setViewMode] = useState("side-by-side"); // 'side-by-side' or 'unified'

  const diff = useMemo(() => {
    if (!text1 && !text2) return [];

    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const result = [];

    // Simple LCS-based diff
    const lcs = computeLCS(lines1, lines2);
    let i = 0, j = 0, k = 0;

    while (i < lines1.length || j < lines2.length) {
      if (k < lcs.length && i < lines1.length && lines1[i] === lcs[k] && j < lines2.length && lines2[j] === lcs[k]) {
        result.push({ type: "same", line1: lines1[i], line2: lines2[j], num1: i + 1, num2: j + 1 });
        i++;
        j++;
        k++;
      } else if (k < lcs.length && i < lines1.length && lines1[i] === lcs[k]) {
        result.push({ type: "added", line1: "", line2: lines2[j], num1: null, num2: j + 1 });
        j++;
      } else if (k < lcs.length && j < lines2.length && lines2[j] === lcs[k]) {
        result.push({ type: "removed", line1: lines1[i], line2: "", num1: i + 1, num2: null });
        i++;
      } else {
        if (i < lines1.length && j < lines2.length) {
          result.push({ type: "changed", line1: lines1[i], line2: lines2[j], num1: i + 1, num2: j + 1 });
          i++;
          j++;
        } else if (i < lines1.length) {
          result.push({ type: "removed", line1: lines1[i], line2: "", num1: i + 1, num2: null });
          i++;
        } else if (j < lines2.length) {
          result.push({ type: "added", line1: "", line2: lines2[j], num1: null, num2: j + 1 });
          j++;
        }
      }
    }

    return result;
  }, [text1, text2]);

  const computeLCS = (arr1, arr2) => {
    const m = arr1.length;
    const n = arr2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (arr1[i - 1] === arr2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Backtrack to find LCS
    const lcs = [];
    let i = m, j = n;
    while (i > 0 && j > 0) {
      if (arr1[i - 1] === arr2[j - 1]) {
        lcs.unshift(arr1[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    return lcs;
  };

  const stats = useMemo(() => {
    const added = diff.filter((d) => d.type === "added").length;
    const removed = diff.filter((d) => d.type === "removed").length;
    const changed = diff.filter((d) => d.type === "changed").length;
    const same = diff.filter((d) => d.type === "same").length;
    return { added, removed, changed, same, total: diff.length };
  }, [diff]);

  const clearAll = () => {
    setText1("");
    setText2("");
  };

  const getLineStyle = (type) => {
    switch (type) {
      case "added":
        return "bg-green-500/20 border-l-4 border-green-500";
      case "removed":
        return "bg-red-500/20 border-l-4 border-red-500";
      case "changed":
        return "bg-yellow-500/20 border-l-4 border-yellow-500";
      default:
        return "bg-transparent border-l-4 border-transparent";
    }
  };

  const getLinePrefix = (type) => {
    switch (type) {
      case "added":
        return "+";
      case "removed":
        return "-";
      case "changed":
        return "~";
      default:
        return " ";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1020] via-[#091224] to-[#050816] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Text Diff</h1>
          <p className="text-gray-400">
            Compare two blocks of text and see the differences
          </p>
        </div>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-400 text-sm">Original Text</label>
              <span className="text-xs text-gray-500">{text1.split("\n").length} lines</span>
            </div>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Paste or type the original text here..."
              rows={12}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-blue-500/50 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-400 text-sm">Modified Text</label>
              <span className="text-xs text-gray-500">{text2.split("\n").length} lines</span>
            </div>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Paste or type the modified text here..."
              rows={12}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-blue-500/50 focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("side-by-side")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                viewMode === "side-by-side"
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Side by Side
            </button>
            <button
              onClick={() => setViewMode("unified")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                viewMode === "unified"
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Unified
            </button>
          </div>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
          >
            <RefreshCw size={16} />
            Clear
          </button>
        </div>

        {/* Stats */}
        {diff.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.added}</div>
              <div className="text-xs text-gray-400">Added</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{stats.removed}</div>
              <div className="text-xs text-gray-400">Removed</div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.changed}</div>
              <div className="text-xs text-gray-400">Changed</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.same}</div>
              <div className="text-xs text-gray-400">Unchanged</div>
            </div>
          </div>
        )}

        {/* Diff Results */}
        {diff.length > 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {viewMode === "side-by-side" ? (
              <div className="grid grid-cols-2 divide-x divide-white/10">
                <div className="p-4">
                  <div className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                    <FileDiff size={16} />
                    Original
                  </div>
                  <div className="font-mono text-sm space-y-0.5">
                    {diff.map((item, idx) => (
                      <div
                        key={idx}
                        className={`px-2 py-1 rounded ${getLineStyle(item.type)} ${
                          item.type === "added" ? "opacity-30" : ""
                        }`}
                      >
                        <span className="text-gray-600 mr-3 select-none w-8 inline-block text-right">
                          {item.num1 || ""}
                        </span>
                        <span className={item.type === "removed" ? "text-red-300" : "text-gray-300"}>
                          {item.line1 || ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                    <FileDiff size={16} />
                    Modified
                  </div>
                  <div className="font-mono text-sm space-y-0.5">
                    {diff.map((item, idx) => (
                      <div
                        key={idx}
                        className={`px-2 py-1 rounded ${getLineStyle(item.type)} ${
                          item.type === "removed" ? "opacity-30" : ""
                        }`}
                      >
                        <span className="text-gray-600 mr-3 select-none w-8 inline-block text-right">
                          {item.num2 || ""}
                        </span>
                        <span className={item.type === "added" ? "text-green-300" : "text-gray-300"}>
                          {item.line2 || ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="text-sm text-gray-400 mb-3">Unified Diff</div>
                <div className="font-mono text-sm space-y-0.5">
                  {diff.map((item, idx) => (
                    <div key={idx} className={`px-2 py-1 rounded ${getLineStyle(item.type)}`}>
                      <span className="mr-2 select-none">{getLinePrefix(item.type)}</span>
                      <span className="text-gray-600 mr-3 select-none">
                        {item.num1 && item.num2
                          ? `${item.num1},${item.num2}`
                          : item.num1 || item.num2 || ""}
                      </span>
                      <span
                        className={
                          item.type === "added"
                            ? "text-green-300"
                            : item.type === "removed"
                            ? "text-red-300"
                            : item.type === "changed"
                            ? "text-yellow-300"
                            : "text-gray-300"
                        }
                      >
                        {item.type === "added"
                          ? item.line2
                          : item.type === "removed"
                          ? item.line1
                          : item.line1 || item.line2}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          text1 || text2 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <ArrowRight size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Enter text in both fields to see the diff</p>
            </div>
          ) : null
        )}

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-6 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500/20 border-l-4 border-green-500 rounded"></div>
            <span className="text-gray-400">Added</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500/20 border-l-4 border-red-500 rounded"></div>
            <span className="text-gray-400">Removed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500/20 border-l-4 border-yellow-500 rounded"></div>
            <span className="text-gray-400">Changed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-transparent border-l-4 border-transparent rounded"></div>
            <span className="text-gray-400">Unchanged</span>
          </div>
        </div>
      </div>
    </div>
  );
}