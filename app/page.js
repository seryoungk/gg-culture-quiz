'use client';
import { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import ProgressBar from '@ramonak/react-progress-bar';

const QUESTIONS = [
  { id: 1, question: '경기도로 떠나는 여행! 어떤 게 더 좋아?', options: [ { text: '역시 여행은 사람이 많아야 재미있지!', value: 'extrovert' }, { text: '난 조용하고 오붓한 게 좋아.', value: 'introvert' }, ], },
  { id: 2, question: '활동적인 게 좋아? 고요한 게 좋아?', options: [ { text: '신나게 움직여야지!', value: 'active' }, { text: '고요히 집중하고 싶어.', value: 'calm' }, ], },
  { id: 3, question: '역사와 과학 중에 더 흥미로운 건?', options: [ { text: '과거 이야기가 좋지. 역사 좋아~', value: 'history' }, { text: '호기심이 최고지! 과학이 좋아!', value: 'science' }, ], },
  { id: 4, question: '음악과 미술 중에 어느 쪽이 더 끌려?', options: [ { text: '귀가 즐거운 음악이 최고야!', value: 'music' }, { text: '눈이 즐거운 미술이 좋아.', value: 'art' }, ], },
  { id: 5, question: '직접 참여하는 게 좋아, 관람하는 게 좋아?', options: [ { text: '직접 체험해야 기억에 남는 것 같아!', value: 'experience' }, { text: '조용히 관람하는 게 난 더 좋아.', value: 'observe' }, ], },
  { id: 6, question: '경기도, 누구랑 갈 예정이야?', options: [ { text: '친구들이랑 같이 갈 예정이야!', value: 'friends' }, { text: '가족이랑 같이 갈 예정이야!', value: 'family' }, ], },
  { id: 7, question: '자연과 도시 중 어디가 좋아?', options: [ { text: '자연 속에서 풀 내음을 맡고 싶어.', value: 'nature' }, { text: '교통편이 쾌적한 도시가 좋아.', value: 'city' }, ], },
  { id: 8, question: '마지막 질문이야, 무료 전시와 유료 전시 중 무엇이 좋아?', options: [ { text: '무료 전시.', value: 'free' }, { text: '유료 전시.', value: 'paid' }, ], },
];

const QuestionBlock = ({ question, options, onAnswer, animateKey }) => (
  <div key={animateKey} className={styles.fadeSlide}>
    <h2 className={styles.title}>{question}</h2>
    <div className={styles.options}>
      {options.map((opt, i) => (
        <button key={i} className={styles.button} onClick={() => onAnswer(opt.value)}>
          {opt.text}
        </button>
      ))}
    </div>
  </div>
);

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  const handleRestart = () => {
    setStep(0);
    setAnswers([]);
    setResults([]);
  };

const TAG_INFO = {
  introvert:  { label: '내향적인',    color: '#A7D3F5' }, // 부드러운 스카이블루
  extrovert:  { label: '외향적인',    color: '#FFB3C6' }, // 산뜻한 로즈핑크
  active:     { label: '활동적인',    color: '#FFD59E' }, // 크림 오렌지
  calm:       { label: '차분한',      color: '#BDE4A8' }, // 파스텔 그린
  history:    { label: '역사',        color: '#D7C4F2' }, // 라일락
  science:    { label: '과학',        color: '#B7E5DD' }, // 민트 블루
  music:      { label: '음악',        color: '#FFB3DE' }, // 딸기우유 핑크
  art:        { label: '미술',        color: '#FFE5A9' }, // 바나나 크림
  experience: { label: '체험형',      color: '#C9F2C7' }, // 연라임 민트
  observe:    { label: '관람',        color: '#F6E9B2' }, // 페일 옐로우
  family:     { label: '가족과 함께', color: '#FDD5B1' }, // 피치 오렌지
  friends:    { label: '친구와 함께', color: '#EBC9F1' }, // 페일 퍼플
  city:       { label: '도시적인',    color: '#D0DDEA' }, // 연그레이 블루
  nature:     { label: '자연적인',    color: '#C3E7B3' }, // 연그린
  free:       { label: '무료 전시',   color: '#B2E4D1' }, // 민트
  paid:       { label: '유료 전시',   color: '#F7B2AD' }, // 연살구 핑크
};


  const handleAnswer = (value) => {
    const updated = [...answers.slice(0, step), value];
    setAnswers(updated);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else {
      setStep('result');
      fetchResults(updated);
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleBack = () => {
    if (typeof step === 'number' && step > 0) setStep(step - 1);
  };

  const fetchResults = async (userTags) => {
    setLoading(true);
    try {
      const res = await fetch('/gyeonggi_culture_tagged_remapped.json');
      const data = await res.json();

      const seen = new Set();
      const scored = data
        .map((item) => {
          const matches = userTags.filter((tag) => item.tags?.[tag] === true);
          return { ...item, matchCount: matches.length, matchedTags: matches };
        })
        .filter((item) => {
          const key = item.title + (item.place ?? item.HOST_INST_NM ?? '');
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

      const sorted = scored.sort((a, b) => b.matchCount - a.matchCount);
      setResults(sorted);
    } catch (e) {
      console.error('데이터 불러오기 실패:', e);
    }
    setLoading(false);
  };

  const progress = step === 'result' ? 100 : Math.round((step / QUESTIONS.length) * 100);
  const current = QUESTIONS[step];

  return (
    <div className={styles.container}>
      {step !== 'result' && (
        <>
          <div style={{marginBottom:"32px"}}>
            <ProgressBar
              completed={progress}
              maxCompleted={100}
              height="16px"
              width="375px"
              borderRadius="20px"
              baseBgColor="lightgray"
              isLabelVisible={false}
              bgColor="#54a6dd"
            />
          </div>

          <QuestionBlock
            question={`Q${current.id}. ${current.question}`}
            options={current.options}
            onAnswer={handleAnswer}
            animateKey={step}
          />

          <div className={styles.navBtns}>
            {step > 0 && (
              <button className={styles.prevButton} onClick={handleBack}>이전으로 돌아가기</button>
            )}
          </div>
        </>
      )}

      {step === 'result' && (
      <div className={styles.resultContainer}>
      <h2 className={styles.resultTitle}>#나의 #해시태그 는</h2>
      <div className={styles.tags}>
        {answers.map((tag) => (
          <span
            key={tag}
            className={styles.tag}
            style={{ backgroundColor: TAG_INFO[tag]?.color || '#eee' }}
          >
            {TAG_INFO[tag]?.label || tag}
          </span>
        ))}
      </div>

      <button className={styles.restartButton} onClick={handleRestart}>
        테스트 다시 하기
      </button>

      <h2 className={styles.resultTitle} style={{marginTop: "40px"}}>나와 마음이 딱 맞는<br></br>경기도 문화체험은 바로,</h2>
      {loading ? (
        <p>로딩 중...</p>
      ) : results.length > 0 ? (
        <>
          <div className={styles.events}>
            {results.slice(0, visibleCount).map((event, index) => (
              <div key={index} className={styles.eventCard}>
                <img src={event.IMAGE_URL} alt={event.TITLE} className={styles.eventImage} />
                <div className={styles.eventContent}>
                  <h3>{event.TITLE}</h3>
                  <p>{event.INST_NM} · {event.BEGIN_DE}~{event.END_DE}</p>
                  <div className={styles.matchedTags}>
                    {event.matchedTags.map((tag) => (
                      <span
                        key={tag}
                        className={styles.tag}
                        style={{ backgroundColor: TAG_INFO[tag]?.color || '#eee' }}
                      >
                        {TAG_INFO[tag]?.label || tag}
                      </span>
                    ))}
                  </div>
                  <Link href={event.URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    <button className={styles.goToButton }>
                      바로가기
                    </button>
                  </Link>
                </div>
              </div>
            ))}
            {visibleCount < results.length && (
              <button onClick={handleShowMore} className={styles.showMoreButton}>
                더보기
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <p style={{marginTop:"40px"}}>딱 맞는 행사를 발견하지는 못했지만,<br></br>이 행사들도 좋아요!</p>
          <button className={styles.goToButton} style={{marginTop:"12px"}}>
            <Link href={'https://ggtour.or.kr/travel-info/festival'}>
              경기관광 홈페이지 바로가기
            </Link>
          </button>
        </>
      )}
      </div>
      )}
    </div>
  );
}
