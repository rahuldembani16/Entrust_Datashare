import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function CaseStudies() {
  const api = useApi();
  const { user } = useAuth();
  const [studies, setStudies] = useState([]);
  useEffect(() => { api('/casestudies').then(setStudies); }, []);

  return <section className="page-stack"><div className="section-heading"><p className="eyebrow">Success stories</p><h1>Case studies</h1>{user.role === 'admin' && <button className="primary-button">Add Case Study</button>}</div><div className="case-grid">{studies.map((study) => <article className="case-card" key={study.id}><img src={study.image_url} alt="" /><div><span>{study.region_name} · {study.crop_name}</span><h3>{study.title}</h3><p>{study.summary}</p><strong>{study.outcome_text}</strong></div></article>)}</div></section>;
}
