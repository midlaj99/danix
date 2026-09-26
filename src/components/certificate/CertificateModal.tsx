import React, { useState, useEffect, useRef } from 'react';
import { SoundManager } from '../../audio/SoundManager';
import { Award, Download, Share2, Check, X, Sparkles, User } from 'lucide-react';

interface CertificateModalProps {
  accuracy: number;
  totalCorrect: number;
  totalQuestions: number;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  accuracy,
  totalCorrect,
  totalQuestions,
  onClose,
}) => {
  const [recipientName, setRecipientName] = useState(() => {
    return localStorage.getItem('danix_cert_recipient') || 'Numpy Champion';
  });
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const certId = `DNX-NP42-${Math.abs(
    (recipientName + accuracy + totalQuestions).split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  )
    .toString(16)
    .toUpperCase()
    .padStart(6, '0')
    .slice(0, 8)}`;

  const drawCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const width = 1920;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // Background Gradient (Deep Obsidian Navy)
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#030712');
    bgGradient.addColorStop(0.5, '#0b1120');
    bgGradient.addColorStop(1, '#020617');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle Grid Texture
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 40; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Outer Decorative Gold Border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 8;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    // Inner Thin Gold Inset
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    // Corner Ornaments
    const cornerSize = 40;
    const corners = [
      [56, 56],
      [width - 56, 56],
      [56, height - 56],
      [width - 56, height - 56],
    ];
    ctx.fillStyle = '#f59e0b';
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Top Header / Academy Branding
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 24px "Cinzel", "Times New Roman", serif, sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('DANIX COMPUTATIONAL REALM & CODING ACADEMY', width / 2, 130);

    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.font = '16px monospace';
    ctx.letterSpacing = '3px';
    ctx.fillText('• VERIFIED CURRICULUM ACCREDITATION •', width / 2, 160);

    // Main Certificate Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 68px "Cinzel", "Georgia", serif, sans-serif';
    ctx.letterSpacing = '8px';
    ctx.fillText('CERTIFICATE OF MASTERY', width / 2, 255);

    // Decorative Gold Underline under Title
    const titleGrad = ctx.createLinearGradient(width / 2 - 300, 0, width / 2 + 300, 0);
    titleGrad.addColorStop(0, 'rgba(245, 158, 11, 0)');
    titleGrad.addColorStop(0.5, 'rgba(245, 158, 11, 1)');
    titleGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.strokeStyle = titleGrad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 320, 280);
    ctx.lineTo(width / 2 + 320, 280);
    ctx.stroke();

    // Conferral Line
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 24px "Georgia", serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('This credential is officially conferred upon', width / 2, 350);

    // Recipient Name
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 64px "Cinzel", "Georgia", serif, sans-serif';
    ctx.letterSpacing = '4px';
    ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
    ctx.shadowBlur = 15;
    ctx.fillText(recipientName.toUpperCase(), width / 2, 440);
    ctx.shadowBlur = 0; // reset

    // Name Underline
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 280, 465);
    ctx.lineTo(width / 2 + 280, 465);
    ctx.stroke();

    // Body Text / Achievement Description
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px "Segoe UI", "Inter", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(
      'for successfully mastering the complete 42-level curriculum of NumPy Vectorization, Multi-Dimensional Tensors,',
      width / 2,
      540
    );
    ctx.fillText(
      'Universal Functions, Dynamic Broadcasting, and Real-Time Computational Combat in Danix: The NumPy RPG.',
      width / 2,
      575
    );

    // Achievement Badges Card
    const badgeY = 640;
    const badgeW = 280;
    const badgeH = 100;
    const badges = [
      { label: 'CURRICULUM', value: '42 / 42 CLEARED', color: '#10b981' },
      { label: 'ACCURACY', value: `${accuracy}%`, color: '#f59e0b' },
      { label: 'SOLVED DRILLS', value: `${totalCorrect} / ${totalQuestions}`, color: '#38bdf8' },
      { label: 'MASTERY TIER', value: 'GRANDMASTER', color: '#a855f7' },
    ];

    const startX = width / 2 - ((badges.length * (badgeW + 24)) - 24) / 2;

    badges.forEach((b, idx) => {
      const bx = startX + idx * (badgeW + 24);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(bx, badgeY, badgeW, badgeH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 13px monospace';
      ctx.letterSpacing = '2px';
      ctx.fillText(b.label, bx + badgeW / 2, badgeY + 36);

      ctx.fillStyle = b.color;
      ctx.font = 'bold 24px monospace';
      ctx.letterSpacing = '1px';
      ctx.fillText(b.value, bx + badgeW / 2, badgeY + 74);
    });

    // Golden Verified Seal (Right side)
    const sealX = width - 260;
    const sealY = 880;

    ctx.save();
    ctx.beginPath();
    ctx.arc(sealX, sealY, 70, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(sealX, sealY, 58, 0, Math.PI * 2);
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 13px monospace';
    ctx.letterSpacing = '1.5px';
    ctx.fillText('★ VERIFIED ★', sealX, sealY - 14);
    ctx.font = 'bold 15px monospace';
    ctx.fillText('NUMPY', sealX, sealY + 8);
    ctx.font = 'bold 13px monospace';
    ctx.fillText('MASTER', sealX, sealY + 28);
    ctx.restore();

    // Signatures and Dates (Left side)
    const sigX = 260;
    const sigY = 890;

    // Aria's Signature
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sigX - 120, sigY);
    ctx.lineTo(sigX + 120, sigY);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'italic bold 22px "Brush Script MT", "Segoe Script", cursive, sans-serif';
    ctx.fillText('Aria, Vector Sentinel', sigX, sigY - 12);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px monospace';
    ctx.fillText('INSTRUCTOR & SENTINEL LEAD', sigX, sigY + 22);

    // Center Details: Date & Credential ID
    ctx.fillStyle = '#64748b';
    ctx.font = '14px monospace';
    ctx.fillText(`ISSUED: ${issueDate.toUpperCase()}`, width / 2, 875);
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 16px monospace';
    ctx.letterSpacing = '2px';
    ctx.fillText(`CREDENTIAL ID: ${certId}`, width / 2, 905);

    ctx.fillStyle = '#475569';
    ctx.font = '12px monospace';
    ctx.fillText('https://danix.academy • SECURE VERIFICATION HASH GENERATED', width / 2, 935);
  };

  useEffect(() => {
    drawCertificate();
  }, [recipientName, accuracy, totalCorrect, totalQuestions]);

  const handleDownload = () => {
    SoundManager.getInstance().playUiClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Danix_NumPy_Mastery_Certificate_${recipientName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyShare = () => {
    SoundManager.getInstance().playUiClick();
    const text = `🏆 Certified NumPy Master! I just completed all 42 levels of Danix: The NumPy Action RPG with an accuracy of ${accuracy}%! Mastered multidimensional array slicing, dynamic broadcasting, and real-time computational combat. Credential ID: ${certId} 🚀 #NumPy #Python #DataScience #CodingGame`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-xl animate-fade-in pointer-events-auto overflow-y-auto">
      <div className="relative w-full max-w-4xl rpg-panel p-5 sm:p-8 shadow-2xl border-amber-500/60 my-auto flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-left">
              <h2 className="text-base sm:text-lg font-rpg font-bold text-white flex items-center gap-2">
                OFFICIAL CERTIFICATE OF MASTERY
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Credential ID: {certId}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close Certificate Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recipient Name Customizer */}
        <div className="w-full max-w-md mb-4 bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5">
          <label className="text-xs font-rpg font-semibold text-slate-300 flex items-center gap-1.5 text-left">
            <User className="w-3.5 h-3.5 text-amber-400" /> Recipient Name (For Official Certificate):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={recipientName}
              onChange={(e) => {
                const val = e.target.value;
                setRecipientName(val);
                localStorage.setItem('danix_cert_recipient', val);
              }}
              maxLength={36}
              placeholder="Enter your full name"
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-amber-500/40 focus:border-amber-400 text-white font-medium text-sm outline-none transition"
            />
          </div>
        </div>

        {/* Live Canvas Certificate Preview */}
        <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl border-2 border-amber-500/50 bg-slate-950 mb-5 relative group">
          <canvas
            ref={canvasRef}
            className="w-full h-auto block select-none pointer-events-none"
            style={{ aspectRatio: '16/9' }}
          />
        </div>

        {/* Action Controls */}
        <div className="w-full max-w-md flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleDownload}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-rpg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 active:scale-95 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            DOWNLOAD HIGH-RES PNG
          </button>

          <button
            onClick={handleCopyShare}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-sky-500/40 hover:border-sky-400 text-sky-200 hover:text-white font-rpg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">COPIED TO CLIPBOARD!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-sky-400" />
                <span>SHARE ON LINKEDIN</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
