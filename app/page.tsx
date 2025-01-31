'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsList, Tabs, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DollarSign, CreditCard, ChartNoAxesColumnIncreasing, Upload, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
	const [info, setInfo] = useState({ total_spent: 0, total_transactions: 0, average_spent: 0, merchants: 0 });
	const [transactions, setTransactions] = useState<any[]>([]);
	const [patterns, setPatterns] = useState<any[]>([]);

	const [selectedFile, setSelectedFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const fileInputRef = useRef(null);

	const handleFileSelect = (event: any) => {
		const file = event.target.files[0];
		if (file) {
			setSelectedFile(file);
			console.log(file);
			// Here you would typically handle the file upload
			handleUpload(file);
		}
	};

	const handleUpload = async (file: string | Blob) => {
		setUploading(true);
		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('https://close-one-whippet.ngrok-free.app/api/upload', {
				method: 'POST',
				body: formData,
				referrerPolicy: 'unsafe-url',
			});

			const data = await response.json();

			if (data) {
				setInfo(data.info);
				setTransactions(data.normalized_transactions);
				setPatterns(data.detected_patterns);
			}

			toast('CSV file processed successfully', {
				description: 'The CSV file has been processed successfully.',
				action: {
					label: 'OK',
					onClick: () => console.log('OK'),
				},
			});

			if (!response.ok) {
				throw new Error('Upload failed');
			}

			setSelectedFile(null);
			if (fileInputRef.current) {
				// @ts-expect-error
				fileInputRef.current.value = '';
			}
		} catch (error) {
			console.error('Upload failed:', error);
		} finally {
			setUploading(false);
		}
	};

	const handleButtonClick = () => {
		// @ts-expect-error
		fileInputRef.current?.click();
	};

	return (
		<div className="justify-center items-center w-full">
			<header className="flex items-center justify-between py-4 px-8 border-b border-solid border-black/[.08] dark:border-white/[.145]">
				<h4 className="text-lg font-semibold">Transaction Analyzer</h4>
				<input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".csv" />
				<Button onClick={handleButtonClick} disabled={uploading}>
					{uploading ? <Loader2 className="animate-spin" /> : <Upload className="w-5 h-5 mr-2" />}
					Upload CSV
				</Button>
			</header>
			<div className="grid gap-4 sm:grid-cols-4 xl:grid-cols-2 p-4">
				<Card className="p-2 bg-white shadow-sm">
					<div className="flex items-center space-x-3">
						<div className="rounded-lg p-2 bg-gray-50 flex items-center justify-center">
							<DollarSign className="w-5 h-5 text-gray-600" />
						</div>
						<div>
							<div className="text-xs font-normal text-gray-600">Total Fee</div>
							<div className="text-lg font-semibold mt-1">${info.total_spent.toFixed(2)}</div>
						</div>
					</div>
				</Card>
				<Card className="p-2 bg-white shadow-sm">
					<div className="flex items-center space-x-3">
						<div className="rounded-lg p-2 bg-gray-50 flex items-center justify-center">
							<CreditCard className="w-5 h-5 text-gray-600" />
						</div>
						<div>
							<div className="text-xs font-normal text-gray-600">Transactions</div>
							<div className="text-lg font-semibold mt-1">{info.total_transactions}</div>
						</div>
					</div>
				</Card>
				<Card className="p-2 bg-white shadow-sm">
					<div className="flex items-center space-x-3">
						<div className="rounded-lg p-2 bg-gray-50 flex items-center justify-center">
							<ChartNoAxesColumnIncreasing className="w-5 h-5 text-gray-600" />
						</div>
						<div>
							<div className="text-xs font-normal text-gray-600">Avg. Transaction</div>
							<div className="text-lg font-semibold mt-1">${info.average_spent.toFixed(2)}</div>
						</div>
					</div>
				</Card>
				<Card className="p-2 bg-white shadow-sm">
					<div className="flex items-center space-x-3">
						<div className="rounded-lg p-2 bg-gray-50 flex items-center justify-center">
							<CreditCard className="w-5 h-5 text-gray-600" />
						</div>
						<div>
							<div className="text-xs font-normal text-gray-600">Merchants</div>
							<div className="text-lg font-semibold mt-1">{info.merchants}</div>
						</div>
					</div>
				</Card>
			</div>
			<div className="p-4">
				<Tabs defaultValue="merchant">
					<TabsList className="grid w-full grid-cols-2 w-[400px]">
						<TabsTrigger value="merchant">Merchant Analysis</TabsTrigger>
						<TabsTrigger value="pattern">Pattern Detection</TabsTrigger>
					</TabsList>
					<TabsContent value="merchant">
						<Card>
							<CardHeader>
								<CardTitle>Normalized Merchants</CardTitle>
								<span className="text-xs text-gray-500">
									AI-powered merchant merchant name normalization and categorization
								</span>
							</CardHeader>
							<CardContent>
								{transactions.map((transaction, index) => (
									<Card key={index} className="mb-4">
										<CardContent className="p-4 grid grid-cols-2 gap-4">
											<div>
												<span className="text-xs text-gray-500">Original</span>
												<p className="text-sm font-semibold mb-2">{transaction.original}</p>
												<Button variant="outline" className="mx-1 rounded-full text-xs px-3 bg-red-100 text-red-500">
													{transaction.category}
												</Button>
												<Button variant="outline" className="mx-1 rounded-full text-xs px-3 bg-red-100 text-red-500">
													{transaction.sub_category}
												</Button>
												{transaction.flags.map((flag: any, index: number) => (
													<Button
														key={index}
														variant="outline"
														className="mx-1 rounded-full text-xs px-3 bg-blue-100 text-blue-500">
														{flag}
													</Button>
												))}
											</div>
											<div className="justify-self-end text-right">
												<span className="text-xs text-gray-500">Normalized</span>
												<p className="text-sm font-semibold mb-2">{transaction.merchant}</p>
											</div>
										</CardContent>
									</Card>
								))}
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="pattern">
						<Card>
							<CardHeader>
								<CardTitle>Detected Patterns</CardTitle>
								<span className="text-xs text-gray-500">Subscriptions and recurring payments detection</span>
							</CardHeader>
							<CardContent>
								{patterns.map((transaction, index) => (
									<Card key={index} className="mb-4">
										<CardContent className="p-4 grid grid-cols-2 gap-4">
											<div>
												<span className="text-sm font-semibold mb-2">{transaction.merchant}</span>
												<p className="text-xs text-gray-500">
													{transaction.type} - {transaction.frequency}
												</p>
												<span className="text-xs mb-2">{transaction.notes}</span>
											</div>
											<div className="justify-self-end text-right">
												<p className="text-sm font-semibold">{transaction.amount}</p>
												<span className="text-xs text-gray-500">
													{transaction.next_expected ? `Next: ${transaction.next_expected}` : ''}
												</span>
											</div>
										</CardContent>
									</Card>
								))}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
