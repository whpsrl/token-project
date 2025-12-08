"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, AnimatePresence } from 'framer-motion'

// ============================================================================
// FREEPPLE WHITEPAPER v4.0
// Tax-Based Protection Model
// Route: /app/whitepaper/page.tsx
// ============================================================================

export default function WhitepaperPage() {
  const [activeSection, setActiveSection] = useState('hero')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll()
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const sections = [
    { id: 'hero', label: 'HERO' },
    { id: 'exec', label: 'EXEC_SUMMARY' },
    { id: 'problem', label: 'PROBLEM' },
    { id: 'solution', label: 'SOLUTION' },
    { id: 'tokenomics', label: 'TOKENOMICS' },
    { id: 'protections', label: 'PROTECTIONS' },
    { id: 'scenarios', label: 'SCENARIOS' },
    { id: 'value', label: 'VALUE' },
    { id: 'roadmap', label: 'ROADMAP' },
    { id: 'security', label: 'SECURITY' },
    { id: 'faq', label: 'FAQ' },
    { id: 'cta', label: 'CTA' },
  ]

  return (
    <div className="min-h-screen bg-black text-[#00ff00] font-mono relative overflow-x-hidden">
      {/* Custom cursor */}
      <motion.div
        className="fixed w-2 h-2 bg-[#00ff00] rounded-full pointer-events-none z-50 mix-blend-difference hidden md:block"
        animate={{ x: mousePos.x - 4, y: mousePos.y - 4 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#00ff00] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Side navigation */}
      <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col gap-1">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`text-[9px] py-1 px-2 border border-[#00ff00] transition-colors duration-200 ${
                activeSection === section.id ? 'bg-[#00ff00] text-black' : 'hover:bg-[#00ff00] hover:text-black'
              }`}
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main>
        {/* HERO */}
        <Section id="hero" setActive={setActiveSection}>
          <div className="min-h-screen flex items-center justify-center border-4 border-[#00ff00] m-2 md:m-4">
            <div className="text-center space-y-6 md:space-y-8 p-4 md:p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-wider mb-4">
                  FREEPPLE_v4.0
                </h1>
                <div className="text-lg md:text-2xl lg:text-3xl mb-8">
                  TAX_BASED_PROTECTION_MODEL
                </div>
                <div className="border-2 border-[#00ff00] p-1 inline-block">
                  <div className="border border-[#00ff00] px-3 md:px-4 py-2 text-xs md:text-sm">
                    KEEP_IT_SIMPLE_TAX_DOES_ALL_THE_WORK
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                <div className="border border-[#00ff00] p-4">
                  <div className="text-xs opacity-70 mb-2">MISSION:</div>
                  <div className="text-xs md:text-sm">
                    ELIMINATE_WHALE_MANIPULATION<br/>
                    VIA_ECONOMIC_PROTECTION<br/>
                    NOT_MECHANICAL_LIMITS
                  </div>
                </div>
                <div className="border border-[#00ff00] p-4">
                  <div className="text-xs opacity-70 mb-2">SPECS:</div>
                  <div className="text-xs space-y-1">
                    <div>VERSION________v4.0</div>
                    <div>DATE__________DEC_2024</div>
                    <div>TOKEN_________FRP</div>
                    <div>NETWORK_______POLYGON</div>
                    <div>SUPPLY________1B_FRP</div>
                  </div>
                </div>
              </div>

              <motion.a
                href="/docs/freepple-whitepaper-v4.pdf"
                download
                className="inline-block border-2 border-[#00ff00] px-6 md:px-8 py-2 md:py-3 text-sm md:text-base hover:bg-[#00ff00] hover:text-black transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                [DOWNLOAD_PDF]
              </motion.a>
            </div>
          </div>
        </Section>

        {/* 01. EXECUTIVE SUMMARY */}
        <Section id="exec" setActive={setActiveSection}>
          <div className="p-4 md:p-8 lg:p-16 max-w-7xl mx-auto">
            <div className="text-xs opacity-50 mb-2">SECTION_01</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 border-b-2 border-[#00ff00] pb-4">
              EXECUTIVE_SUMMARY
            </h2>
            
            <Alert type="error">
              ⚠️ CRITICAL: 95% of crypto tokens fail within 12 months due to whale manipulation and team rug pulls.
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
              <div>
                <h3 className="text-xl mb-4 underline">THE_PROBLEM:</h3>
                <p className="text-sm leading-relaxed mb-4">
                  Crypto market dominated by pump & dump schemes. Whales manipulate projects with concentrated supply. 
                  Teams execute rug pulls. Early investors dump on retail. Result: 95% of tokens lose all value in 6-12 months.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-[#00ff00] pb-1">
                    <span>SAFEMOON:</span>
                    <span className="text-red-500">-95%_IN_18_MONTHS</span>
                  </div>
                  <div className="flex justify-between border-b border-[#00ff00] pb-1">
                    <span>SAITAMA:</span>
                    <span className="text-red-500">$0_PRACTICALLY</span>
                  </div>
                  <div className="flex justify-between border-b border-[#00ff00] pb-1">
                    <span>EVERGROW:</span>
                    <span className="text-red-500">-80%_IN_6_MONTHS</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl mb-4 underline">THE_SOLUTION:</h3>
                <p className="text-sm leading-relaxed mb-4">
                  Freepple uses TAX-BASED PROTECTION instead of complex mechanical limits. 
                  High tax early (15%) makes pump&dump unprofitable. Tax decreases gradually (8% → 3% → 1%) 
                  allowing momentum and CEX listing.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>WHALE_ATTACK_COSTS_15%_EVERY_TIME</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>AUTO_FINANCING_VIA_TAX_REVENUE</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>SCALABLE_TO_CEX_TIER_1_(BINANCE)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>SIMPLE_NO_COMPLEX_LIMITS</span>
                  </div>
                </div>
              </div>
            </div>

            <DataTable
              title="KEY_METRICS"
              headers={['METRIC', 'VALUE', 'BENCHMARK']}
              rows={[
                ['MAX_WALLET', '2%_SUPPLY', 'VS_1%_OTHERS'],
                ['SELL_TAX_EARLY', '15%_DAY_1-30', 'VS_10%_STANDARD'],
                ['SELL_TAX_MATURE', '1%_PERMANENT', 'VS_0%_NO_REVENUE'],
                ['TEAM_VESTING', '5_YEARS', 'VS_9+_SUICIDE'],
                ['LP_LOCK', '2_YEARS', 'INDUSTRY_STANDARD'],
                ['CEX_READY', 'MONTH_4+', 'MOST_NEVER'],
              ]}
            />
          </div>
        </Section>

        {/* 02. THE PROBLEM */}
        <Section id="problem" setActive={setActiveSection}>
          <div className="p-4 md:p-8 lg:p-16 max-w-7xl mx-auto">
            <div className="text-xs opacity-50 mb-2">SECTION_02</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 border-b-2 border-[#00ff00] pb-4">
              THE_PROBLEM
            </h2>

            <h3 className="text-2xl mb-6 underline">PUMP_&_DUMP_CYCLE:</h3>
            <div className="space-y-4 mb-12">
              {[
                { phase: 'PRE_LAUNCH', time: '1-2_WEEKS', action: 'HYPE_MARKETING_1000X', result: 'FOMO_RETAIL' },
                { phase: 'LAUNCH', time: '10_SECONDS', action: 'BOTS_BUY_40%_SUPPLY', result: 'PRICE_10X' },
                { phase: 'PUMP', time: '1-7_DAYS', action: 'WHALE_DUMPS', result: 'PRICE_-80%' },
                { phase: 'AFTERMATH', time: '1-3_MONTHS', action: 'TEAM_ABANDONS', result: 'TOKEN_→_$0' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="text-2xl">→</div>
                  <div className="flex-1 border border-[#00ff00] p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <div className="opacity-70 mb-1">PHASE:</div>
                        <div className="font-bold">{item.phase}</div>
                      </div>
                      <div>
                        <div className="opacity-70 mb-1">TIME:</div>
                        <div>{item.time}</div>
                      </div>
                      <div>
                        <div className="opacity-70 mb-1">ACTION:</div>
                        <div>{item.action}</div>
                      </div>
                      <div>
                        <div className="opacity-70 mb-1">RESULT:</div>
                        <div className="text-red-400">{item.result}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-2xl mb-6 underline">CASE_STUDIES_FAILURES:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CaseStudy
                title="SAFEMOON"
                result="-95%_18M"
                lesson="TAX_FIXED_10%_KILLED_VOLUME"
              />
              <CaseStudy
                title="SAITAMA"
                result="→_$0"
                lesson="PROMISES_NO_DELIVERY_=_SCAM"
              />
              <CaseStudy
                title="EVERGROW"
                result="-80%_6M"
                lesson="TAX_14%_TOO_HIGH_ZERO_LIQUIDITY"
              />
            </div>
          </div>
        </Section>

        {/* 03. SOLUTION */}
        <Section id="solution" setActive={setActiveSection}>
          <div className="p-4 md:p-8 lg:p-16 max-w-7xl mx-auto">
            <div className="text-xs opacity-50 mb-2">SECTION_03</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 border-b-2 border-[#00ff00] pb-4">
              TAX_BASED_MODEL
            </h2>

            <div className="border-2 border-[#00ff00] p-6 mb-8">
              <h3 className="text-xl mb-4">CORE_PRINCIPLE:</h3>
              <div className="text-sm leading-relaxed mb-4">
                High tax early makes whale pump&dump unprofitable. Tax decreases gradually allowing momentum. 
                Tax revenue auto-finances project via buyback + LP growth.
              </div>
              <div className="border border-[#00ff00] p-4 text-xs bg-black/50 font-mono">
                IF_WHALE_BUYS_ALL_→_ONLY_OPTION_SELL<br/>
                SELLING_→_PAY_TAX_15%<br/>
                TAX_→_50%_BUYBACK_30%_LP_20%_MARKETING<br/>
                WHALE_SELF_DESTRUCTS_PROJECT_WINS
              </div>
            </div>

            <DataTable
              title="TAX_TIMELINE"
              headers={['PERIOD', 'DAYS', 'TAX', 'PURPOSE']}
              rows={[
                ['PHASE_1', '1-30', '15%', 'LAUNCH_PROTECTION'],
                ['PHASE_2', '31-90', '8%', 'CONTROLLED_GROWTH'],
                ['PHASE_3', '91-180', '3%', 'CEX_READY'],
                ['PHASE_4', '181+', '1%', 'SUSTAINABILITY'],
              ]}
            />

            <h3 className="text-2xl mt-12 mb-6 underline">TAX_DISTRIBUTION:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureBlock
                icon="💰"
                title="BUYBACK_&_BURN"
                percentage="50%"
                items={['BUYS_FRP', 'BURNS_TOKENS', 'FLOOR_PRICE', 'REDUCES_SUPPLY']}
              />
              <FeatureBlock
                icon="🌊"
                title="LIQUIDITY_POOL"
                percentage="30%"
                items={['ADDS_LP', 'STRONGER_POOL', 'LESS_SLIPPAGE', 'STABLE_PRICE']}
              />
              <FeatureBlock
                icon="📈"
                title="MARKETING"
                percentage="20%"
                items={['CAMPAIGNS', 'DEVELOPMENT', 'OPERATIONS', 'GROWTH']}
              />
            </div>
          </div>
        </Section>

        {/* 04. TOKENOMICS */}
        <Section id="tokenomics" setActive={setActiveSection}>
          <div className="p-4 md:p-8 lg:p-16 max-w-7xl mx-auto">
            <div className="text-xs opacity-50 mb-2">SECTION_04</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 border-b-2 border-[#00ff00] pb-4">
              TOKENOMICS_v4.0
            </h2>

            <DataTable
              title="SUPPLY_DISTRIBUTION"
              headers={['ALLOCATION', 'TOKENS', '%', 'VESTING']}
              rows={[
                ['PRESALE', '150M', '15%', 'IMMEDIATE'],
                ['REFERRAL', '50M', '5%', 'IMMEDIATE'],
                ['LIQUIDITY', '200M', '20%', 'LOCKED_2Y'],
                ['TEAM', '100M', '10%', '5_YEARS'],
                ['MARKETING', '100M', '10%', '2_YEARS'],
                ['STAKING', '200M', '20%', '3_YEARS'],
                ['TREASURY', '100M', '10%', '2_YEARS'],
                ['AIRDROP', '100M', '10%', '1_YEAR'],
              ]}
            />

            <h3 className="text-2xl mt-12 mb-6 underline">TEAM_VESTING_5_YEARS:</h3>
            <DataTable
              title="VESTING_SCHEDULE"
              headers={['PERIOD', 'UNLOCK', 'CUMULATIVE', 'TOKENS']}
              rows={[
                ['YEAR_1', '0%', '0%', '0_FRP_(CLIFF)'],
                ['YEAR_2', '10%', '10%', '10M_FRP'],
                ['YEAR_3', '20%', '30%', '30M_TOTAL'],
                ['YEAR_4', '30%', '60%', '60M_TOTAL'],
                ['YEAR_5', '40%', '100%', '100M_TOTAL'],
              ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="border border-[#00ff00] p-4">
                <div className="text-sm mb-2">STANDARD_WALLETS:</div>
                <div className="text-2xl text-cyan-400 mb-2">2%_SUPPLY</div>
                <div className="text-xs opacity-70">20M_FRP_MAX</div>
              </div>
              <div className="border border-[#00ff00] p-4">
                <div className="text-sm mb-2">CEX_VERIFIED:</div>
                <div className="text-2xl text-cyan-400 mb-2">10%_SUPPLY</div>
                <div className="text-xs opacity-70">100M_FRP_FOR_BINANCE</div>
              </div>
            </div>
          </div>
        </Section>

        {/* 05. PROTECTIONS */}
        <Section id="protections" setActive={setActiveSection}>
          <div className="p-4 md:p-8 lg:p-16 max-w-7xl mx-auto">
            <div className="text-xs opacity-50 mb-2">SECTION_05</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 border-b-2 border-[#00ff00] pb-4">
              PROTECTIONS_(19_MECHANISMS)
            </h2>

            <DataTable
              title="CATEGORIES"
              headers={['CATEGORY', 'COUNT', 'PRIORITY']}
              rows={[
                ['LAUNCH_PROTECTION', '4', '🔴_MUST'],
                ['ECONOMIC_PROTECTION', '4', '🔴_MUST'],
                ['STRUCTURAL', '3', '🔴_MUST'],
                ['TECHNICAL', '5', '🟡_USEFUL'],
                ['LEGAL', '3', '🔴_MUST'],
              ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <FeatureBlock icon="🛡️" title="WHITELIST_6_SEC" items={['PRESALE_ONLY', 'BLOCKS_BOTS', 'FAIR_LAUNCH']} />
              <FeatureBlock icon="💸" title="TAX_15%→1%" items={['DECREASING', 'AUTO_FINANCING', 'CEX_READY']} />
              <FeatureBlock icon="🔒" title="TEAM_VESTING" items={['5_YEARS', 'CLIFF_1Y', 'ON-CHAIN']} />
              <FeatureBlock icon="🔐" title="LP_LOCK_2Y" items={['UNICRYPT', 'NO_RUG_PULL', 'VERIFIED']} />
              <FeatureBlock icon="🔍" title="AUDIT_CERTIK" items={['€10K', 'SECURITY', 'TRUST_BADGE']} />
              <FeatureBlock icon="🎯" title="MULTI_SIG_3/5" items={['GNOSIS', 'DISTRIBUTED', 'TRANSPARENT']} />
            </div>

            <div className="mt-12">
              <h3 className="text-xl mb-4 underline">BUDGET:</h3>
              <DataTable
                headers={['ITEM', 'COST', 'STATUS']}
                rows={[
                  ['AUDIT_CERTIK', '€10,000', 'Q1_2025'],
                  ['LEGAL_DOCS', '€2,000', 'PRE-LAUNCH'],
                  ['LP_LOCK', '€200', 'LAUNCH'],
                  ['KYC_TEAM', '€1,000', 'Q1_2025'],
                  ['_TOTAL_', '_€13,200_', '-'],
                ]}
              />
            </div>
          </div>
        </Section>

        {/* 06. SCENARIOS */}
        <Section id="scenarios" setActive={setActiveSection}>
          <div className="p-4 md:p-8 lg:p-16 max-w-7xl mx-auto">
            <div className="text-xs opacity-50 mb-2">SECTION_06</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 border-b-2 border-[#00ff00] pb-4">
              SCENARIOS_&_PROJECTIONS
            </h2>

            <Alert>
              5 realistic scenarios tested. All presale holders win: worst +500%, best +2,900% ROI
            </Alert>

            <DataTable
              title="SCENARIOS_SUMMARY"
              headers={['SCENARIO', 'TIME', 'ROI', 'OUTCOME']}
              rows={[
                ['WHALE_ATTACK', '1_WEEK', '+400%', '✅_SURVIVED'],
                ['ORGANIC', '6_MONTHS', '+2,400%', '✅_EXCELLENT'],
                ['VIRAL', '2_WEEKS', '+1,900%', '✅_STRONG'],
                ['BEAR_MARKET', '6_MONTHS', '+500%', '✅_SURVIVED'],
                ['CEX_LISTING', '12_MONTHS', '+2,900%', '✅_VICTORY'],
              ]}
            />

            <div className="grid grid-cols-1 gap-8 mt-12">
              <ScenarioCard
                title="SCENARIO_1_WHALE_ATTACK"
                color="yellow"
                points={[
                  'WHALE_€100K_TRIES_PUMP&DUMP',
                  'PAYS_€26K_IN_TAX_(15%)',
                  'PROJECT_GAINS_€26K',
                  'PRESALE_STILL_+400%',
                  'NOT_REPEATABLE'
                ]}
              />
              <ScenarioCard
                title="SCENARIO_2_ORGANIC_GROWTH"
                color="green"
                points={[
                  '6_MONTHS_NATURAL_GROWTH',
                  'TAX_REVENUE_€300K+',
                  'POOL_€80K_→_€800K',
                  'PRESALE_+2,400%_ROI',
                  'CEX_TIER-2_READY'
                ]}
              />
              <ScenarioCard
                title="SCENARIO_4_BEAR_MARKET"
                color="red"
                points={[
                  'BITCOIN_-30%_PANIC',
                  'FRP_-70%_BUT_SURVIVES',
                  'BUYBACK_PREVENTS_-90%',
                  'PRESALE_STILL_+500%',
                  'VS_OTHERS_→_ZERO'
                ]}
              />
              <ScenarioCard
                title="SCENARIO_5_CEX_LISTING"
                color="green"
                points={[
                  'BINANCE_APPLICATION_MONTH_9',
                  'TREASURY_PAYS_€300K_FEE',
                  'LISTING_→_10X_VOLUME',
                  'PRESALE_+2,900%_ROI',
                  'MAINSTREAM_ADOPTION'
                ]}
              />
            </div>

            <Alert type="success">
              KEY_INSIGHT: Tax mechanism works in ALL scenarios. Presale holders win ALWAYS.
            </Alert>
          </div>
        </Section>

        {/* 07. VALUE */}
        <Section id="value" setActive={setActiveSection}>
          <div className="p-4 md:p-8 lg:p-16 max-w-7xl mx-auto">
            <div className="text-xs opacity-50 mb-2">SECTION_07</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 border-b-2 border-[#00ff00] pb-4">
              REAL_VALUE_GENERATION
            </h2>

            <Alert>
              €10K/month verifiable profits. Not just speculation.
            </Alert>

            <DataTable
              title="REVENUE_STREAMS"
              headers={['STREAM', '%', 'MONTHLY', 'VERIFICATION']}
              rows={[
                ['MINING', '50%', '€5,000', 'PUBLIC_WALLETS'],
                ['TRADING', '30%', '€3,000', 'DASHBOARD_API'],
                ['B2B', '20%', '€2,000', 'INVOICES'],
                ['_TOTAL_', '_100%_', '_€10,000_', '_TRANSPARENT_'],
              ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Metric label="CURRENT" value="€10K/M" />
              <Metric label="TARGET_Q4" value="€50K/M" />
              <Metric label="MARGIN" value="~60%" />
            </div>
          </div>
        </Section>

        {/* 08. ROADMAP */}
        <Section id="roadmap" setActive={setActiveSection}>
          <div className="p-4 md:p-8 lg:p-16 max-w-7xl mx-auto">
            <div className="text-xs opacity-50 mb-2">SECTION_08</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 border-b-2 border-[#00ff00] pb-4">
              ROADMAP_2025
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RoadmapCard
                quarter="Q1_2025"
                status="IN_PROGRESS"
                items={['PRESALE_€150K', 'AUDIT_CERTIK', 'DEX_LAUNCH', 'COMMUNITY_1K+']}
              />
              <RoadmapCard
                quarter="Q2_2025"
                status="PLANNED"
                items={['CMC/CG_LISTING', 'PARTNERSHIPS', '€10K/M_PROFITS', 'HOLDERS_5K+']}
              />
              <RoadmapCard
                quarter="Q3_2025"
                status="PLANNED"
                items={['MEXC/GATE_LISTING', 'MOBILE_APP', 'STAKING_LIVE', 'MCAP_€10M+']}
              />
              <RoadmapCard
                quarter="Q4_2025"
                status="TARGET"
                items={['BINANCE_APP', '€50K/M_PROFITS', 'HOLDERS_25K+', 'GOVERNANCE_DAO']}
              />
            </div>
          </div>
        </Section>

        {/* 09. SECURITY */}
        <Section id="security" setActive={setActiveSection}>
          <div className="p-4 md:p-8 lg:p-16 max-w-7xl mx-auto">
            <div className="text-xs opacity-50 mb-2">SECTION_09</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 border-b-2 border-[#00ff00] pb-4">
              TEAM_&_SECURITY
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-[#00ff00] p-6">
                <h3 className="text-xl mb-4 underline">TEAM:</h3>
                <p className="text-sm leading-relaxed">
                  10+ years combined experience in crypto trading, smart contract development, structural engineering. 
                  Italian team based in Milano.
                </p>
              </div>
              <div className="border border-[#00ff00] p-6">
                <h3 className="text-xl mb-4 underline">KYC:</h3>
                <p className="text-sm leading-relaxed">
                  CertiK private KYC completed. Team verified but not publicly doxxed. 
                  Maintains privacy while ensuring accountability.
                </p>
              </div>
            </div>

            <DataTable
              title="AUDIT_STATUS"
              headers={['PROVIDER', 'STATUS', 'COST']}
              rows={[
                ['CERTIK', 'IN_PROGRESS', '€10,000'],
                ['SOLIDPROOF', 'PLANNED', '€3,000'],
              ]}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <SecurityBadge icon="🔐" label="MULTI-SIG" value="3/5" />
              <SecurityBadge icon="🔒" label="LP_LOCK" value="2_YEARS" />
              <SecurityBadge icon="⏰" label="VESTING" value="5_YEARS" />
              <SecurityBadge icon="🐛" label="BOUNTY" value="€10K" />
            </div>
          </div>
        </Section>

        {/* 10. FAQ */}
        <Section id="faq" setActive={setActiveSection}>
          <div className="p-4 md:p-8 lg:p-16 max-w-7xl mx-auto">
            <div className="text-xs opacity-50 mb-2">SECTION_10</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 border-b-2 border-[#00ff00] pb-4">
              FAQ
            </h2>

            <div className="space-y-4">
              <FAQItem
                question="WHY_15%_TAX_EARLY?"
                answer="15% for first 30 days makes whale pump&dump unprofitable. After 2-3 attempts whale has lost 30-45% in tax. Tax then decreases to 8% → 3% → 1%."
              />
              <FAQItem
                question="CAN_I_SELL_ANYTIME?"
                answer="YES! After day 7 no mechanical limits. You only pay tax. We leave you free (you pay reasonable tax) vs other projects that block you for months."
              />
              <FAQItem
                question="HOW_PREVENT_TEAM_DUMP?"
                answer="Team has 100M FRP (10%) locked in vesting contract. Year 1: zero. Year 2-5: gradual unlock. Verifiable on-chain. If team dumps, price drops = damages themselves."
              />
              <FAQItem
                question="CEX_LISTING_POSSIBLE?"
                answer="YES. Tax drops to 3% (month 4) and 1% (month 6+). Binance/Coinbase accept tax <5%. Max wallet 10% for verified CEX. All requirements satisfied."
              />
              <FAQItem
                question="BEAR_MARKET_SURVIVAL?"
                answer="Scenario 4 demonstrates: automatic buyback (50% tax) prevents death spiral. Other projects -95%, FRP -70% but THEN recovers. Real profits €10K/month sustain ops even in bear."
              />
            </div>
          </div>
        </Section>

        {/* 11. CTA */}
        <Section id="cta" setActive={setActiveSection}>
          <div className="min-h-screen flex items-center justify-center border-4 border-[#00ff00] m-2 md:m-4">
            <div className="text-center space-y-6 md:space-y-8 p-4 md:p-8">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">
                JOIN_THE_PRESALE
              </h2>
              <div className="text-lg md:text-xl">
                €500_MAX_|_300_SPOTS_TOTAL
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Metric label="TARGET" value="€150K" />
                <Metric label="SPOTS" value="300" />
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
                <motion.a
                  href="/register"
                  className="border-2 border-[#00ff00] px-8 md:px-12 py-3 md:py-4 text-base md:text-xl hover:bg-[#00ff00] hover:text-black transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  [JOIN_PRESALE]
                </motion.a>
                <motion.a
                  href="/docs/freepple-whitepaper-v4.pdf"
                  download
                  className="border-2 border-[#00ff00] px-8 md:px-12 py-3 md:py-4 text-base md:text-xl hover:bg-[#00ff00] hover:text-black transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  [DOWNLOAD_PDF]
                </motion.a>
              </div>

              <div className="mt-12 text-xs md:text-sm opacity-70">
                <div className="mb-4">CONTRACT:_[TBD_POST_LAUNCH]</div>
                <div className="flex flex-wrap justify-center gap-4">
                  <a href="https://t.me/freepple" className="hover:text-cyan-400">TELEGRAM</a>
                  <span>|</span>
                  <a href="https://twitter.com/freeppletoken" className="hover:text-cyan-400">TWITTER</a>
                  <span>|</span>
                  <a href="https://freepple.com/dashboard" className="hover:text-cyan-400">DASHBOARD</a>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <footer className="border-t-4 border-[#00ff00] p-4 md:p-8 text-center text-xs md:text-sm">
          <div className="mb-4">
            FREEPPLE_©_2024_|_TAX-BASED_PROTECTION_|_v4.0
          </div>
          <div className="text-xs opacity-70">
            NOT_FINANCIAL_ADVICE_|_CRYPTO_IS_VOLATILE_|_INVEST_RESPONSIBLY
          </div>
        </footer>
      </main>
    </div>
  )
}

// ============================================================================
// COMPONENTS
// ============================================================================

function Section({ 
  id, 
  children, 
  setActive 
}: { 
  id: string
  children: React.ReactNode
  setActive: (id: string) => void
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(id)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [id, setActive])

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.section>
  )
}

function Alert({ children, type = 'default' }: { children: React.ReactNode; type?: 'default' | 'error' | 'success' }) {
  const colors = {
    default: 'border-[#00ff00]',
    error: 'border-red-500 text-red-400',
    success: 'border-[#00ff00] bg-[#00ff00]/10'
  }

  return (
    <div className={`border-2 ${colors[type]} p-4 my-6 text-sm leading-relaxed`}>
      {children}
    </div>
  )
}

function DataTable({ 
  title, 
  headers, 
  rows 
}: { 
  title?: string
  headers: string[]
  rows: string[][]
}) {
  return (
    <div className="my-8 overflow-x-auto">
      {title && <h3 className="text-xl mb-4 underline">{title}:</h3>}
      <div className="border-2 border-[#00ff00] min-w-full">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#00ff00] text-black">
              {headers.map((header, i) => (
                <th key={i} className="p-2 text-left border-r border-black last:border-r-0 whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-[#00ff00]">
                {row.map((cell, j) => (
                  <td key={j} className="p-2 border-r border-[#00ff00] last:border-r-0 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CaseStudy({ title, result, lesson }: { title: string; result: string; lesson: string }) {
  return (
    <div className="border-2 border-red-500 p-4">
      <h4 className="text-lg mb-3 text-red-400">{title}</h4>
      <div className="space-y-2 text-xs">
        <div>
          <span className="opacity-70 text-red-400">RESULT:</span>
          <div className="mt-1 text-red-400">{result}</div>
        </div>
        <div className="border-t border-red-500 pt-2">
          <span className="opacity-70 text-[#00ff00]">LESSON:</span>
          <div className="mt-1 text-[#00ff00]">{lesson}</div>
        </div>
      </div>
    </div>
  )
}

function FeatureBlock({ 
  icon, 
  title, 
  percentage, 
  items 
}: { 
  icon: string
  title: string
  percentage?: string
  items: string[]
}) {
  return (
    <div className="border border-[#00ff00] p-4">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm font-bold mb-1">{title}</div>
      {percentage && <div className="text-xl text-cyan-400 mb-3">{percentage}</div>}
      <div className="space-y-1 text-xs">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span>•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#00ff00] p-4 text-center">
      <div className="text-xs opacity-70 mb-2">{label}:</div>
      <div className="text-xl md:text-2xl font-bold text-cyan-400">{value}</div>
    </div>
  )
}

function ScenarioCard({ title, color, points }: { title: string; color: 'green' | 'yellow' | 'red'; points: string[] }) {
  const colors = {
    green: 'border-[#00ff00]',
    yellow: 'border-yellow-400',
    red: 'border-red-500'
  }

  return (
    <div className={`border-2 ${colors[color]} p-6`}>
      <h4 className="text-xl mb-4">{title}</h4>
      <div className="space-y-2 text-xs">
        {points.map((point, i) => (
          <div key={i} className="flex items-start gap-2">
            <span>→</span>
            <span>{point}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RoadmapCard({ quarter, status, items }: { quarter: string; status: string; items: string[] }) {
  const statusColors: Record<string, string> = {
    'IN_PROGRESS': 'text-yellow-400 border-yellow-400',
    'PLANNED': 'text-cyan-400 border-cyan-400',
    'TARGET': 'text-[#00ff00] border-[#00ff00]',
  }

  return (
    <div className={`border-2 ${statusColors[status]} p-6`}>
      <div className="text-sm opacity-70 mb-1">{quarter}</div>
      <div className={`text-xs mb-4 px-2 py-1 border ${statusColors[status]} inline-block`}>
        {status}
      </div>
      <div className="space-y-2 text-xs">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span>✓</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SecurityBadge({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="border border-[#00ff00] p-4 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-xs mb-1">{label}</div>
      <div className="text-sm text-cyan-400">{value}</div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-[#00ff00]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-4 text-left flex justify-between items-center hover:bg-[#00ff00] hover:text-black transition-colors duration-200"
      >
        <span className="text-sm">{question}</span>
        <span className="text-xl">{open ? '−' : '+'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-[#00ff00] overflow-hidden"
          >
            <div className="p-4 text-sm leading-relaxed bg-black/50">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
