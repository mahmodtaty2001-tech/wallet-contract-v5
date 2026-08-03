import { toNano, Address, beginCell } from 'ton-core';
import { JettonMinter } from '../wrappers/jetton-minter';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    console.log('');
    console.log('═'.repeat(70));
    console.log('🎉 نشر Jetton Token - عملة محمود');
    console.log('🎉 Deploying Jetton Token - Mahmoud Coin');
    console.log('═'.repeat(70));
    console.log('');

    // معلومات الـ Jetton
    const tokenName = 'Mahmoud Coin';
    const tokenSymbol = 'MHM';
    const tokenDecimals = 18;
    const tokenImage = 'https://via.placeholder.com/128';
    const totalSupply = '1000000'; // 1 مليون عملة

    console.log('📊 معلومات العملة:');
    console.log('📊 Token Information:');
    console.log('');
    console.log(`   اسم العملة: ${tokenName}`);
    console.log(`   الرمز: ${tokenSymbol}`);
    console.log(`   العدد العشري: ${tokenDecimals}`);
    console.log(`   الإجمالي: ${totalSupply}`);
    console.log('');
    console.log('═'.repeat(70));
    console.log('');

    // إنشاء محتوى الـ Jetton (Metadata)
    const content = beginCell()
        .storeUint(0, 8) // off-chain metadata
        .storeStringTail('https://example.com/jetton.json')
        .endCell();

    // كود محفظة الـ Jetton
    const jettonWalletCode = await compile('jetton_wallet');

    // إنشاء الـ Jetton Minter
    const jettonMinter = JettonMinter.createFromConfig(
        {
            admin: provider.sender().address!,
            content,
            jettonWalletCode,
        },
        await compile('jetton_minter')
    );

    console.log('📍 عنوان الـ Jetton:');
    console.log('📍 Jetton Address:');
    console.log('');
    console.log('   ' + jettonMinter.address.toString());
    console.log('');
    console.log('═'.repeat(70));
    console.log('');

    // النشر على Mainnet
    console.log('🚀 جاري نشر الـ Jetton على Mainnet...');
    console.log('🚀 Deploying Jetton to Mainnet...\n');

    await jettonMinter.sendDeploy(provider.sender(), toNano('1'));

    console.log('⏳ جاري الانتظار حتى اكتمال النشر...');
    console.log('⏳ Waiting for deployment...\n');

    await provider.waitForDeploy(jettonMinter.address);

    console.log('');
    console.log('✅ تم نشر الـ Jetton بنجاح!');
    console.log('✅ Jetton deployed successfully!\n');
    console.log('═'.repeat(70));
    console.log('');

    // طلب الـ Jetton Data
    const jettonData = await jettonMinter.getJettonData(provider.provider());

    console.log('💎 بيانات الـ Jetton:');
    console.log('💎 Jetton Data:');
    console.log('');
    console.log(`   الإجمالي المتداول: ${Number(jettonData.totalSupply) / Math.pow(10, tokenDecimals)} ${tokenSymbol}`);
    console.log(`   المسؤول (Admin): ${jettonData.admin.toString()}`);
    console.log('');
    console.log('═'.repeat(70));
    console.log('');

    // معلومات النشر
    console.log('📝 معلومات مهمة:');
    console.log('📝 Important Information:');
    console.log('');
    console.log('✅ تم النشر على Mainnet');
    console.log('✅ Deployed on Mainnet');
    console.log('');
    console.log('🔗 الرابط:');
    console.log(`   https://tonscan.org/address/${jettonMinter.address.toString()}`);
    console.log('');
    console.log('💰 النسبة الأسبوعية:');
    console.log('   50% للمشروع');
    console.log('   50% للمستثمرين');
    console.log('');
    console.log('═'.repeat(70));
    console.log('');
    console.log('🎊 مبروك يا محمود! عملتك الخاصة أصبحت حية! 🎊');
    console.log('🎊 Congratulations! Your token is now live! 🎊');
    console.log('');
}
