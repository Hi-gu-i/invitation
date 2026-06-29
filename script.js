let selectedTheme = 'light';

const nameInput = document.getElementById('name-input');
const previewBtn = document.getElementById('preview-btn');
const backBtn = document.getElementById('back-btn');
const inputScreen = document.getElementById('input-screen');
const invitationScreen = document.getElementById('invitation-screen');
const displayName = document.getElementById('display-name');
const colorBtns = document.querySelectorAll('.color-btn');

colorBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    colorBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedTheme = btn.dataset.theme;
  });
});

previewBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    nameInput.placeholder = '이름을 입력해 주세요!';
    return;
  }
    displayName.textContent = name;
  invitationScreen.className = `screen theme-${selectedTheme}`;
  const dome = invitationScreen.querySelector('.bg-dome');
  dome.src = selectedTheme === 'dark' ? 'dark-dome.svg' : 'dome.svg';
  const graphic = invitationScreen.querySelector('.bg-graphic');
  graphic.src = selectedTheme === 'dark' ? 'dark-graphic.svg' : 'graphic.svg';
  inputScreen.classList.add('hidden');
  invitationScreen.classList.remove('hidden');
  window.scrollTo(0, 0);
});

backBtn.addEventListener('click', () => {
  invitationScreen.classList.add('hidden');
  inputScreen.classList.remove('hidden');
  window.scrollTo(0, 0);
});

document.getElementById('save-btn').addEventListener('click', async () => {
  try {
    const btns = document.querySelectorAll('#back-btn, .action-right');
    btns.forEach(el => el.style.visibility = 'hidden');
    const canvas = await html2canvas(invitationScreen, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
    });
    btns.forEach(el => el.style.visibility = '');
    const link = document.createElement('a');
    link.download = `초대장_${displayName.textContent}님.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (e) {
    document.querySelectorAll('#back-btn, .action-right').forEach(el => el.style.visibility = '');
    alert('저장 중 오류가 발생했습니다.');
  }
});

document.getElementById('share-btn').addEventListener('click', async () => {
  try {
    const btns = document.querySelectorAll('#back-btn, .action-right');
    btns.forEach(el => el.style.visibility = 'hidden');
    const canvas = await html2canvas(invitationScreen, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
    });
    btns.forEach(el => el.style.visibility = '');
    canvas.toBlob(async (blob) => {
      const file = new File([blob], '초대장.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: '졸업전시회 초대장',
          text: `${displayName.textContent} 님을 초대합니다!`,
          files: [file],
        });
      } else {
        alert('공유 기능은 모바일에서 지원됩니다.\n저장 후 직접 공유해 주세요!');
      }
    });
  } catch (e) {
    document.querySelectorAll('#back-btn, .action-right').forEach(el => el.style.visibility = '');
    if (e.name !== 'AbortError') alert('공유 중 오류가 발생했습니다.');
  }
});