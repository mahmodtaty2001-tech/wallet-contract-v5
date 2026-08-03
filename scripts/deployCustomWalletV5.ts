import { Dictionary, toNano } from 'ton-core';
import { WalletId, WalletV5 } from '../wrappers/wallet-v5';
import { compile, NetworkProvider } from '@ton/blueprint';
import { LibraryDeployer } from '../wrappers/library-deployer';
import { getSecureRandomBytes, keyPairFromSeed } from 'ton-crypto';

/**
 * 🔐 محفظة TON V5 مخصصة - Custom TON Wallet V5
 * Deploy a custom TON Wallet V5 with your own keys
 * 
 * تقوم هذه الدالة بـ:
 * 1. إنشاء زوج مفاتيح جديد
 * 2. إنشاء محفظة TON V5
 * 3. نشر المحفظة على الشبكة
 * 4. إعادة عنوان المحفظة الجديدة
 */
export async function run(provider: NetworkProvider) {
    console.log('');
    console.log('🚀 بدء نشر محفظة TON V5...');
    console.log('🚀 Starting TON Wallet V5 deployment...\n');

    // إنشاء زوج المفاتيح العشوائي
    const keypair = keyPairFromSeed(await getSecureRandomBytes(32));
    
    console.log('📝 معلومات المحفظة الجديدة:');
    console.log('📝 New Wallet Information:');
    console.log('─'.repeat(60));
    console.log('');
    console.log('✏️ المفتاح العام (Public Key):');
    console.log('   ' + keypair.publicKey.toString('hex'));
    console.log('');
    console.log('🔑 المفتاح الخاص (Private Key):');
    console.log('   ' + keypair.secretKey.toString('hex'));
    console.log('');
    console.log('─'.repeat(60));

    // تكوين المحفظة
    const walletV5 = provider.open(
        WalletV5.createFromConfig(
            {
                signatureAllowed: true,
                seqno: 0,
                walletId: new WalletId({ networkGlobalId: -3 }).serialized, // testnet
                publicKey: keypair.publicKey,
                extensions: Dictionary.empty() as any
            },
            LibraryDeployer.exportLibCode(await compile('wallet_v5'))
        )
    );

    console.log('');
    console.log('⏳ جاري إرسال المحفظة للنشر...');
    console.log('⏳ Sending wallet deployment...\n');

    // إرسال المحفظة للنشر
    await walletV5.sendDeploy(provider.sender(), toNano('0.1'));

    // انتظار نشر المحفظة
    console.log('⏳ جاري انتظار اكتمال النشر...');
    console.log('⏳ Waiting for deployment...\n');
    
    await provider.waitForDeploy(walletV5.address);

    console.log('');
    console.log('✅ تم نشر المحفظة بنجاح!');
    console.log('✅ Wallet deployed successfully!\n');
    console.log('═'.repeat(60));
    console.log('');
    console.log('🔐 عنوان المحفظة الجديدة:');
    console.log('🔐 New Wallet Address:');
    console.log('');
    console.log('   📍 ' + walletV5.address.toString());
    console.log('');
    console.log('═'.repeat(60));
    console.log('');
    console.log('⚠️  تنبيه أمني - Security Warning:');
    console.log('');
    console.log('🔴 لا تفعل هذا:');
    console.log('   ❌ لا تشارك المفاتيح الخاصة مع أحد');
    console.log('   ❌ لا تحفظها في ملفات علنية');
    console.log('   ❌ لا تنسخها في الحوارات العامة');
    console.log('');
    console.log('✅ افعل هذا:');
    console.log('   ✔️  احفظ المفاتيح في مكان آمن جداً');
    console.log('   ✔️  استخدم محافظ موثوقة مثل Tonkeeper');
    console.log('   ✔️  تحقق من عناوين المتلقي قبل الإرسال');
    console.log('');
    console.log('═'.repeat(60));
    console.log('');
    console.log('💰 الخطوات التالية:');
    console.log('💰 Next Steps:');
    console.log('');
    console.log('1. احفظ بيانات المحفظة في مكان آمن');
    console.log('   Save wallet information securely');
    console.log('');
    console.log('2. أضف رصيد للمحفظة من Tonkeeper');
    console.log('   Add balance from Tonkeeper');
    console.log('');
    console.log('3. ابدأ في إرسال التحويلات');
    console.log('   Start sending transactions');
    console.log('');
    console.log('═'.repeat(60));
    console.log('');
}
