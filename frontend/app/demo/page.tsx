'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../lib/i18n';
import Link from 'next/link';

interface TestResult {
  step: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  data?: Record<string, unknown>;
}

interface TestStep {
  key: string;
  name: string;
  description: string;
}

const testSteps: TestStep[] = [
  { key: 'anvil', name: 'Start Anvil Network', description: 'Launch local blockchain' },
  { key: 'deploy', name: 'Deploy Contracts', description: 'Deploy OpenPNTs and Sale contracts' },
  { key: 'alice', name: 'Alice Creates PNT', description: 'Alice creates CoffeeCoin loyalty points' },
  { key: 'sale', name: 'Create Sale', description: 'Alice creates a presale for CoffeeCoin' },
  { key: 'bob', name: 'Bob Participates', description: 'Bob joins the presale' },
  { key: 'complete', name: 'Complete Sale', description: 'Finalize the sale process' },
];

export default function DemoPage() {
  const { t } = useLanguage();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const initializeTestResults = useCallback(() => {
    setTestResults(testSteps.map(step => ({
      step: step.key,
      status: 'pending'
    })));
  }, []);

  useEffect(() => {
    initializeTestResults();
  }, [initializeTestResults]);

  const simulateTest = async (stepKey: string, delay: number = 1000) => {
    // Update status to running
    setTestResults(prev => prev.map(result => 
      result.step === stepKey 
        ? { ...result, status: 'running' }
        : result
    ));

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, delay));

    // Simulate different outcomes based on step
    const success = Math.random() > 0.1; // 90% success rate for demo

    setTestResults(prev => prev.map(result => 
      result.step === stepKey 
        ? { 
            ...result, 
            status: success ? 'success' : 'error',
            message: success ? getSuccessMessage(stepKey) : 'Operation failed',
            data: success ? getTestData(stepKey) : undefined
          }
        : result
    ));

    return success;
  };

  const getSuccessMessage = (stepKey: string): string => {
    switch (stepKey) {
      case 'anvil': return 'Anvil running on port 8545';
      case 'deploy': return 'Contracts deployed successfully';
      case 'alice': return 'CoffeeCoin created (ID: 0, Supply: 1000)';
      case 'sale': return 'Sale created with 500 tokens at 0.001 ETH each';
      case 'bob': return 'Bob purchased 100 CoffeeCoin tokens';
      case 'complete': return 'Sale completed successfully';
      default: return 'Step completed';
    }
  };

  const getTestData = (stepKey: string): Record<string, unknown> | undefined => {
    switch (stepKey) {
      case 'deploy':
        return {
          OpenPNTs: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          SaleFactory: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
        };
      case 'alice':
        return {
          tokenId: 0,
          name: 'CoffeeCoin',
          symbol: 'COFFEE',
          totalSupply: 1000
        };
      case 'sale':
        return {
          saleAddress: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
          tokensForSale: 500,
          pricePerToken: '0.001 ETH'
        };
      default:
        return undefined;
    }
  };

  const runFullTest = async () => {
    setIsRunning(true);
    
    for (const step of testSteps) {
      const success = await simulateTest(step.key, 1500);
      if (!success) {
        break; // Stop on first failure
      }
    }
    
    setIsRunning(false);
  };

  const runSingleTest = async (stepKey: string) => {
    if (isRunning) return;
    await simulateTest(stepKey);
  };

  const resetTests = () => {
    initializeTestResults();
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'running': return '🔄';
      case 'success': return '✅';
      case 'error': return '❌';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return 'text-gray-500';
      case 'running': return 'text-blue-500';
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center bg-white shadow-sm">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('platform.title')} - Demo
          </h1>
        </Link>
        
        <Link href="/">
          <button type="button" className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            ← Back to Home
          </button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">{t('test.mode')}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('test.description')}
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl">🧪</span>
              <span className="ml-2 font-semibold text-gray-800">Simulation Mode</span>
            </div>
            <p className="text-sm text-gray-600">
              This demo simulates the complete OpenPNTs workflow without requiring MetaMask or real transactions.
            </p>
          </div>
        </div>

        {/* Test Controls */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              <button
                type="button"
                onClick={runFullTest}
                disabled={isRunning}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? '🔄 Running Tests...' : '🚀 Run Full Demo'}
              </button>
              
              <button
                type="button"
                onClick={resetTests}
                disabled={isRunning}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔄 Reset
              </button>
            </div>

            {/* Alice & Bob Story Header */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                  <span className="ml-2 font-semibold">Alice (Business Owner)</span>
                </div>
                <p className="text-sm text-gray-600">Creates CoffeeCoin loyalty points for her coffee shop</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">B</div>
                  <span className="ml-2 font-semibold">Bob (Customer)</span>
                </div>
                <p className="text-sm text-gray-600">Purchases CoffeeCoin tokens in the presale</p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {testSteps.map((step, index) => {
              const result = testResults.find(r => r.step === step.key);
              const isError = result?.status === 'error';
              const isRunning = result?.status === 'running';

              return (
                <div key={step.key} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full font-bold text-gray-600">
                        {index + 1}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{step.name}</h3>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={`text-2xl ${getStatusColor(result?.status || 'pending')}`}>
                        {getStatusIcon(result?.status || 'pending')}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => runSingleTest(step.key)}
                        disabled={isRunning || result?.status === 'running'}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Test
                      </button>
                    </div>
                  </div>

                  {/* Test Result Details */}
                  {result?.message && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className={`text-sm font-medium ${isError ? 'text-red-600' : 'text-green-600'}`}>
                        {result.message}
                      </p>
                      
                      {result.data && (
                        <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                          <pre>{JSON.stringify(result.data, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Results Summary */}
        {testResults.some(r => r.status === 'success') && (
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-green-800 mb-4">🎉 Demo Results</h3>
              <p className="text-green-700 mb-6">
                You&apos;ve successfully simulated the OpenPNTs platform workflow!
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold mb-2">What Alice Accomplished:</h4>
                  <ul className="text-sm space-y-1">
                    <li>✅ Created CoffeeCoin loyalty points</li>
                    <li>✅ Set up a presale for customers</li>
                    <li>✅ Raised funds for her business</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">What Bob Accomplished:</h4>
                  <ul className="text-sm space-y-1">
                    <li>✅ Discovered CoffeeCoin presale</li>
                    <li>✅ Purchased tokens for future rewards</li>
                    <li>✅ Became part of Alice&apos;s loyalty program</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-green-200">
                <p className="text-sm text-green-600">
                  Ready to try with real transactions? Connect your wallet and deploy to a testnet!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 