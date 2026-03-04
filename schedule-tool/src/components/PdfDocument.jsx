import { format } from 'date-fns'
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from '@react-pdf/renderer'

const navy   = '#14133A'
const card   = '#1E1D42'
const pink   = '#F0629E'
const teal   = '#84D6E2'
const purple = '#9B59B6'
const divider = '#2D2B5A'
const white  = '#FFFFFF'
const muted  = '#898A9E'

const styles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: navy,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: white,
  },

  /* ── Header ── */
  header: {
    marginBottom: 20,
  },
  brand: {
    fontSize: 7,
    color: muted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: white,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 8,
    color: muted,
  },

  /* ── Card shell ── */
  card: {
    backgroundColor: card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: divider,
  },
  cardHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: pink,
    letterSpacing: 2.5,
  },

  /* ── Two-column grid ── */
  columns: {
    flexDirection: 'row',
  },
  colLeft: {
    flex: 1,
  },
  colRight: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: divider,
  },

  /* ── Milestone row ── */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: divider,
  },
  rowFirst: {
    borderTopWidth: 0,
  },

  /* ── Date pill badge ── */
  badge: {
    borderWidth: 1,
    borderColor: pink,
    borderRadius: 999,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 8,
    paddingRight: 8,
    minWidth: 68,
    marginRight: 10,
  },
  badgeTeal: {
    backgroundColor: teal,
    borderColor: teal,
  },
  badgeTealText: {
    color: navy,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: white,
    letterSpacing: 1,
    textAlign: 'center',
  },

  /* ── Milestone label ── */
  labelRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 9,
    color: white,
  },

  /* ── Client action tag ── */
  clientTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.35)',
    backgroundColor: 'rgba(155, 89, 182, 0.12)',
    borderRadius: 999,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 6,
    paddingRight: 6,
  },
  clientDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: purple,
  },
  clientText: {
    fontSize: 6,
    fontWeight: 'bold',
    color: purple,
    letterSpacing: 1.5,
  },

  /* ── Legend ── */
  cardHeaderRow: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: purple,
  },
  legendText: {
    fontSize: 6,
    color: muted,
    letterSpacing: 1.5,
  },

  /* ── Footer ── */
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7,
    color: muted,
  },
})

/**
 * PdfDocument — matches the on-screen branded dark-navy, two-column,
 * pill-badge timeline design.
 */
export function PdfDocument({ milestones = [], anchorDate, dateType, designMode }) {
  const anchorStr  = anchorDate ? format(anchorDate, 'MMM d, yyyy') : '—'
  const modeStr    = dateType === 'go-live' ? 'Go-live' : 'Kick-off'
  const designStr  = designMode === 'client' ? 'Client design' : 'PadSquad design'
  const lastIndex  = milestones.length - 1

  const splitAt = Math.ceil(milestones.length / 2)
  const left  = milestones.slice(0, splitAt)
  const right = milestones.slice(splitAt)

  const renderRow = (m, globalIndex, localIndex) => {
    const isLaunch = globalIndex === lastIndex
    const isFirst  = localIndex === 0
    return (
      <View
        key={`${m.label}-${m.bdOffset}`}
        style={[styles.row, isFirst && styles.rowFirst]}
      >
        <View style={[styles.badge, isLaunch && styles.badgeTeal]}>
          <Text style={[styles.badgeText, isLaunch && styles.badgeTealText]}>
            {format(m.date, 'd MMM').toUpperCase()}
          </Text>
        </View>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{m.label}</Text>
          {m.isClientAction && (
            <View style={styles.clientTag}>
              <View style={styles.clientDot} />
              <Text style={styles.clientText}>CLIENT</Text>
            </View>
          )}
        </View>
      </View>
    )
  }

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>PADSQUAD</Text>
          <Text style={styles.title}>Campaign Timelines & Schedule</Text>
          <Text style={styles.subtitle}>
            {modeStr} date: {anchorStr} · {designStr}
          </Text>
        </View>

        {/* Timeline card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionLabel}>CAMPAIGN TIMELINE</Text>
            <View style={styles.legend}>
              <View style={styles.legendDot} />
              <Text style={styles.legendText}>CLIENT ACTION REQUIRED</Text>
            </View>
          </View>
          <View style={styles.columns}>
            <View style={styles.colLeft}>
              {left.map((m, i) => renderRow(m, i, i))}
            </View>
            <View style={styles.colRight}>
              {right.map((m, i) => renderRow(m, i + splitAt, i))}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>PadSquad · solutions.padsquad.com</Text>
          <Text>Generated {format(new Date(), 'MMM d, yyyy')}</Text>
        </View>

      </Page>
    </Document>
  )
}

export default PdfDocument
