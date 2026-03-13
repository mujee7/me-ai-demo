import './style.css'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'

type TabKey = 'vault' | 'prove' | 'ledger' | 'earnings' | 'agent'

const shortenAddress = (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4)

export const App: React.FC = () => {
  const { address, isConnected, chainId } = useAccount()
  const [inVault, setInVault] = useState(false)
  const [vaultData, setVaultData] = useState('age: 28\nmood: focused\nlocation: London')
  const [vaultCreated, setVaultCreated] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('vault')
  const [zkpStatus, setZkpStatus] = useState<'idle' | 'loading' | 'verified'>('idle')
  const [ledgerRows, setLedgerRows] = useState<
    { id: number; description: string; status: 'pending' | 'approved'; amount?: number; timestamp?: string }[]
  >([
    { id: 1, description: 'AI Agent requested health data', status: 'pending' },
    { id: 2, description: 'Research partner requested activity summary', status: 'pending' },
  ])
  const [balance, setBalance] = useState(0.5)
  const [isLicensing, setIsLicensing] = useState(false)
  const [agentDeployed, setAgentDeployed] = useState(false)
  const sepoliaChainId = 11155111


  const { open } = useAppKit()
  
  const handleEnterVault = () => {
    setInVault(true)
  }

  const handleCreateVault = () => {
    setVaultCreated(true)
    setActiveTab('prove')
  }

  const handleProve = () => {
    if (zkpStatus === 'loading') return
    setZkpStatus('loading')
    setTimeout(() => {
      setZkpStatus('verified')
      setAgentDeployed(true)
      setActiveTab('agent')
    }, 1200)
  }

  const handleApproveRow = (id: number) => {
    const now = new Date().toLocaleTimeString()
    setLedgerRows(rows =>
      rows.map(row =>
        row.id === id && row.status === 'pending'
          ? { ...row, status: 'approved', amount: 0.25, timestamp: now }
          : row,
      ),
    )
    setBalance(b => parseFloat((b + 0.25).toFixed(2)))
  }

  const handleLicenseData = () => {
    if (isLicensing) return
    setIsLicensing(true)
    setTimeout(() => {
      setBalance(b => parseFloat((b + 0.25).toFixed(2)))
      setIsLicensing(false)
    }, 900)
  }

  const renderWalletHeader = () => (
    <header className="top-bar">
      <div className="logo-mark">
        <span>ME.ai</span>
      </div>
      <div className="wallet-area">
        {!isConnected ? (
      <></>
        ) : (
          <div className="wallet-connected">
            <span className="badge badge-muted">
              {chainId === sepoliaChainId ? 'Connected on Sepolia' : `Chain ID ${chainId}`}
            </span>
            <span className="wallet-address">{shortenAddress(address ?? '')}</span>
            {!inVault && (
              <button className="secondary" onClick={handleEnterVault}>
                Enter Vault
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  )

  const renderTabs = () => (
    <nav className="tabs">
      {(['vault', 'prove', 'ledger', 'earnings', 'agent'] as TabKey[]).map(tab => (
        <button
          key={tab}
          className={`tab ${activeTab === tab ? 'tab-active' : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab === 'vault' && 'Vault'}
          {tab === 'prove' && 'Prove'}
          {tab === 'ledger' && 'Ledger'}
          {tab === 'earnings' && 'Earnings'}
          {tab === 'agent' && 'Agent'}
        </button>
      ))}
    </nav>
  )

  const renderVault = () => (
    <section className="panel">
      <h1>Create Your Sovereign Vault</h1>
      <p className="muted">
        Enter mock private data. This stays in your sovereign vault — never exposed.
      </p>
      <textarea
        className="vault-input"
        value={vaultData}
        onChange={e => setVaultData(e.target.value)}
      />
      <button className="primary large" onClick={handleCreateVault}>
        Lock into Vault
      </button>
      {vaultCreated && (
        <div className="pulse-orb success">
          <div className="orb-core" />
          <p className="success-text">Vault created – your data is now sovereign.</p>
        </div>
      )}
    </section>
  )

  const renderProve = () => (
    <section className="panel">
      <h1>Prove Without Revealing</h1>
      <p className="muted">
        One-click Zero-Knowledge demo using your vault data — no age or details ever leave the browser.
      </p>
      <button
        className="primary large"
        onClick={handleProve}
        disabled={zkpStatus === 'loading'}
      >
        {zkpStatus === 'idle' && 'Prove Age > 18'}
        {zkpStatus === 'loading' && 'Generating Proof...'}
        {zkpStatus === 'verified' && 'Proof Verified'}
      </button>
      <div className={`pulse-orb ${zkpStatus}`}>
        <div className="orb-core" />
        {zkpStatus === 'loading' && <div className="orb-ring spinning" />}
        {zkpStatus === 'verified' && <div className="particle-burst" />}
      </div>
      {zkpStatus === 'verified' && (
        <p className="success-text">
          Proof Verified — age confirmed privately. No raw data exposed.
        </p>
      )}
    </section>
  )

  const renderLedger = () => (
    <section className="panel">
      <h1>Reciprocity Ledger</h1>
      <p className="muted">
        Every approved request is logged and rewarded. This is a mock two-way data trade.
      </p>
      <div className="ledger-table">
        <div className="ledger-row ledger-header">
          <span>Request</span>
          <span>Status</span>
          <span>Earned</span>
          <span>Action</span>
        </div>
        {ledgerRows.map(row => (
          <div key={row.id} className="ledger-row">
            <span>{row.description}</span>
            <span className={row.status === 'approved' ? 'badge badge-success' : 'badge'}>
              {row.status === 'approved' ? 'Approved' : 'Pending'}
            </span>
            <span>{row.amount ? `${row.amount.toFixed(2)} USDC` : '—'}</span>
            <span>
              {row.status === 'pending' ? (
                <button className="secondary small" onClick={() => handleApproveRow(row.id)}>
                  Approve
                </button>
              ) : (
                <span className="timestamp">{row.timestamp}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  )

  const renderEarnings = () => (
    <section className="panel">
      <h1>Mock Stablecoin Earnings</h1>
      <p className="muted">
        License your data and watch test USDC appear as glowing orbs.
      </p>
      <div className="balance-card">
        <div className="balance-label">Your Balance</div>
        <div className="balance-value">{balance.toFixed(2)} test USDC</div>
      </div>
      <div className="earnings-actions">
        <button
          className="primary large"
          onClick={handleLicenseData}
          disabled={isLicensing}
        >
          {isLicensing ? 'Licensing...' : 'License Data'}
        </button>
        <div className={`token-rain ${isLicensing ? 'active' : ''}`}>
          <div className="token-orb" />
          <div className="token-orb" />
          <div className="token-orb" />
        </div>
      </div>
    </section>
  )

  const renderAgent = () => (
    <section className="panel">
      <h1>Sovereign Agent Stub</h1>
      <p className="muted">
        This mock agent acts permissionlessly on your data within ZKP boundaries.
      </p>
      {!agentDeployed && (
        <button className="primary large" onClick={() => setAgentDeployed(true)}>
          Deploy My Sovereign Agent
        </button>
      )}
      <div className="agent-area">
        <div className={`pulse-orb ${agentDeployed ? 'success' : ''}`}>
          <div className="orb-core" />
          {agentDeployed && <div className="agent-icon">⚡</div>}
        </div>
        {agentDeployed ? (
          <div className="agent-copy">
            <p className="success-text">
              Agent now acting permissionlessly on your data.
            </p>
            <p className="muted">
              Mock action: analysed your pulse and suggested your next optimal move.
            </p>
          </div>
        ) : (
          <p className="muted">Deploy your agent to see it in action.</p>
        )}
      </div>
    </section>
  )

  const showContent = () => {
    if (!isConnected) {
      return (
        <section className="panel panel-center">
          <h1>Connect Wallet to Enter</h1>
          <p className="muted">
            Clean, dark login screen with a single door into your sovereign vault.
          </p>
          <div className="wallet-button-row">
  <button className="custom-wallet-btn" onClick={() => open()}>
    Connect Wallet
  </button>
</div>
          <p className="wallet-hint">
            Connect with any supported wallet via AppKit (WalletConnect) on Sepolia.
          </p>
        </section>
      )
    }

    if (!inVault) {
      return (
        <section className="panel panel-center">
          <h1>Wallet Connected</h1>
          <p className="muted">
            {shortenAddress(address ?? '')} ·{' '}
            {chainId === sepoliaChainId ? 'Connected on Sepolia' : `Chain ID ${chainId}`}
          </p>
          <button className="primary large" onClick={handleEnterVault}>
            Enter Vault
          </button>
        </section>
      )
    }

    return (
      <>
        {renderTabs()}
        {activeTab === 'vault' && renderVault()}
        {activeTab === 'prove' && renderProve()}
        {activeTab === 'ledger' && renderLedger()}
        {activeTab === 'earnings' && renderEarnings()}
        {activeTab === 'agent' && renderAgent()}
      </>
    )
  }

  return (
    <div className="app-shell">
      {renderWalletHeader()}
      <main className="main-surface">
        <div className="background-particles" />
        <div className="pulse-orb backdrop">
          <div className="orb-core" />
        </div>
        <div className="content">{showContent()}</div>
      </main>
      <footer className="footer">
        <span>ME.ai POC · Demo only · No real data or funds</span>
      </footer>
    </div>
  )
}

