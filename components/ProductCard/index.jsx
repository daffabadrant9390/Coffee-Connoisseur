import Link from 'next/link';
import Image from 'next/image';
import styles from './index.module.scss';
import cx from 'classnames';

const ProductCard = ({ productTitle, imgUrl, href }) => {
  return (
    <Link href={href}>
      <a className={styles.card_link}>
        <div className={cx('glass', styles.product_card)}>
          <div className={styles.card_header}>
            <h2 className={styles.text_product}>{productTitle}</h2>
          </div>
          <div className={styles.card_image}>
            <Image
              src={imgUrl}
              width={260}
              height={160}
              alt=""
              className={styles.image_product}
              objectFit="cover"
              objectPosition="center"
            />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ProductCard;
