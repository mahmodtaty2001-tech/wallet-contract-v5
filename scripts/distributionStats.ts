import { toNano, Address } from 'ton-core';
import { Distribution } from '../wrappers/distribution';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    console.log('');
    console.log('═'.repeat(70));
    console.log('📊 إحصائيات نظام التوزيع');
    console.log('📊 Distribution System Statistics');
    console.log('═'.repeat(70));
    console.log('');

    const distributionAddress = Address.parse('EQC...'); // أضف عنوان العقد هنا
    const distribution = provider.open(Distribution.createFromAddress(distributionAddress));

    console.log('⏳ جاري جمع البيانات...');
    console.log('⏳ Gathering statistics...\n');

    const stats = await distribution.getTotalStats(provider.provider());

    const totalDistributed = Number(stats.totalDistributed) / 1e9;
    const totalClaimed = Number(stats.totalClaimed) / 1e9;
    const pending = totalDistributed - totalClaimed;

    console.log('═'.repeat(70));
    console.log('💰 ملخص الأرباح:');
    console.log('💰 Rewards Summary:');
    console.log('═'.repeat(70));
    console.log('');
    console.log('📈 إجمالي الأرباح الموزعة:');
    console.log('   ' + totalDistributed.toFixed(4) + ' TON');
    console.log('');
    console.log('✅ الأرباح المسحوبة:');
    console.log('   ' + totalClaimed.toFixed(4) + ' TON');
    console.log('');
    console.log('⏳ الأرباح المعلقة:');
    console.log('   ' + pending.toFixed(4) + ' TON');
    console.log('');
    console.log('═'.repeat(70));
    console.log('');
    console.log('🎯 معلومات إضافية:');
    console.log('');
    console.log('📅 آخر تحديث: ' + new Date().toLocaleString('ar-EG'));
    console.log('🔄 التحديث التلقائي: كل 5 دقائق');
    console.log('');
    console.log('═'.repeat(70));
    console.log('');
}
